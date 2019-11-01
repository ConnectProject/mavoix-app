<style lang="stylus" scoped>
.card
  height fit-content
  width 80%
.card-img-wrapper
  height 100%
  width 100%
  display flex
  justify-content center
  align-items center
  & img
    width 80%
    height 80%
.circle:before
  content '\25CF'
  font-size 100%
  color red
.name
  white-space nowrap
</style>

<template>
  <q-card
    ref="card"
    class="card" :style="`transform: translate(${translateX}px, ${translateY}px)`"
    v-touch:moving="onTouchMove" v-touch:end="_onTouchEnd"
    :disabled="!item.available">
    <q-img :ratio="1.8" :src="item.asset.file._url">
      <div class="card-img-wrapper" v-if="!item.available">
        <img src="../assets/red_circle.svg"/>
      </div>
    </q-img>

    <q-card-section>
      <div class="text-h6 text-center name">{{ item.name }}</div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'ItemCardComponent',
  data () {
    return {
      translateX: 0,
      translateY: 0,
      initialX: 0,
      initialY: 0
    }
  },
  methods: {
    onTouchMove ({ changedTouches: [ touch ] }) {
      if (this.item.available) {
        let card = this.$refs.card.$el
        if (!this.initialX || !this.initialY) {
          this.initialX = card.getBoundingClientRect().left
          this.initialY = card.getBoundingClientRect().top
        }

        this.translateX = (touch.pageX - this.initialX - (card.clientWidth / 2))
        this.translateY = (touch.pageY - this.initialY - (card.clientHeight / 2))
      }
    },
    _onTouchEnd (event) {
      if (this.item.available) {
        this.onTouchEnd(event, this.item)
        this.translateX = 0
        this.translateY = 0
        this.initialX = 0
        this.initialY = 0
      }
    }
  },
  props: [
    'item',
    'onTouchEnd'
  ]
}
</script>
