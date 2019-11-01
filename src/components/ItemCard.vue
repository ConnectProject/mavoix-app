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
    class="card" :style="`opacity: ${dragged ? 0.1 : 1}; transform: translate(${translateX}px, ${translateY}px)`"
    :draggable="item.available" @dragstart="onDragStart" @dragend="onDragEnd"
    v-touch:moving="onTouchMove" v-touch:end="onTouchEnd"
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
      dragged: false,
      translateX: 0,
      translateY: 0,
      initialX: 0,
      initialY: 0
    }
  },
  methods: {
    onDragStart () {
      if (this.item.available) {
        this.$store.commit('dropZone/setDragged', this.item)
        this.dragged = true
      }
    },
    onDragEnd () {
      this.$store.commit('dropZone/setDragged', null)
      this.dragged = false
    },
    onTouchMove ({ changedTouches: [ touch ] }) {
      let card = this.$refs.card.$el
      if (!this.initialX || !this.initialY) {
        this.initialX = card.getBoundingClientRect().left
        this.initialY = card.getBoundingClientRect().top
      }

      this.translateX = (touch.pageX - this.initialX - (card.clientWidth / 2))
      this.translateY = (touch.pageY - this.initialY - (card.clientHeight / 2))
    },
    onTouchEnd (event) {
      console.log(event)
    }
  },
  watch: {
    item (newValue) {
      if (newValue.dragged) this.dragged = true
      else this.dragged = false
    }
  },
  mounted () {
    if (this.item.dragged) this.dragged = true
  },
  props: [
    'item'
  ]
}
</script>
