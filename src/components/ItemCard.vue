<style lang="stylus" scoped>
.card
  height fit-content
  width 90%
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
  padding 8px
  width 100%
  left 0px
  border-radius 0px 0px 8px 8px
  background white
  position absolute
  bottom 0
</style>

<template>
  <q-card
    ref="card"
    class="card"
    :style="`transform: translate(${translateX}px, ${translateY}px)`"
    v-touch:moving="onTouchMove"
    v-touch:end="internalOnTouchEnd"
    v-touch:start="internalOnTouchStart"
    :disabled="!item.available"
  >
    <q-img
      :ratio="0.8"
      :src="item.asset.url"
    >
      <div
        v-if="!item.available"
        class="card-img-wrapper"
      >
        <img src="../assets/red_circle.svg"/>
      </div>
    </q-img>

    <q-card-section>
      <div class="text-h6 text-center name">
        {{ item.name }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'ItemCardComponent',
  props: [
    'item',
    'index',
    'onTouchEnd',
    'onTouchStart',
    'onTouchMoveProps'
  ],
  data () {
    return {
      translateX: 0,
      translateY: 0,
      initialX: 0,
      initialY: 0
    }
  },
  methods: {
    /**
     * Handle drag item
     */
    onTouchMove ({ changedTouches: [ touch ] }) {
      if (this.item.available) {
        const card = this.$refs.card.$el
        this.onTouchMoveProps(touch, this.item, this.index)
        /**
         * Set the card initial position if previously unset
         */
        if (!this.initialX || !this.initialY) {
          this.initialX = card.getBoundingClientRect().left
          this.initialY = card.getBoundingClientRect().top
        }

        /**
         * Translate the card to the new mouse position
         */
        this.translateX = (touch.pageX - this.initialX - (card.clientWidth / 2))
        this.translateY = (touch.pageY - this.initialY - (card.clientHeight / 2))
      }
    },
    /**
     * Call the prop's callback and reset data
     */
    internalOnTouchEnd ($event) {
      if (this.item.available) {
        this.onTouchEnd($event, this.item, this.index)
        this.translateX = 0
        this.translateY = 0
        this.initialX = 0
        this.initialY = 0
      }
    },
    internalOnTouchStart (event) {
      if (this.onTouchStart) {
        this.onTouchStart(event, this.item, this.index)
      }
    }
  }
}
</script>
