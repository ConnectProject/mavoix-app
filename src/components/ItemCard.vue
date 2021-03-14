<style lang="stylus" scoped>
.card-container
  padding 10%
  box-sizing border-box
.card
  height 100%
  background white
  position relative
.q-img
  height: 80%
.card-img-wrapper
  position absolute
  height 100%
  width 100%
  display flex
  justify-content center
  align-items center
.circle:before
  content '\25CF'
  font-size 100%
  color red
.q-card__section
  padding 0
  height: 20%
  vertical-align: middle
  font-family: Menlo-bold
</style>

<template>
  <div
    class="card-container"
    :style="{height: rowHeight + 'px', width: columnWidth + 'px'}"
  >
    <q-card
      ref="card"
      class="card"
      :style="`transform: translate(${translateX}px, ${translateY}px)`"
      v-touch:moving="onTouchMove"
      v-touch:end="internalOnTouchEnd"
      v-touch:start="internalOnTouchStart"
    >
      <q-img
        :src="item.asset.url"
        contain
      >
        <div
          v-if="disabled"
          class="card-img-wrapper"
        >
          <img src="../assets/red_circle.svg"/>
        </div>
      </q-img>
      <q-card-section class="text-h6 text-center" :style="'font-size: ' + Math.min((columnWidth / Math.min(item.name.length,27))*1.2, rowHeight/10) +'px'">
          {{ item.name.substring(0,24) }}{{ item.name.length > 27 ? '...' : '' }}
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'ItemCardComponent',
  props: {
    item: Object,
    index: Number,
    onTouchEnd: Function,
    onTouchStart: Function,
    onTouchMoveProps: Function,
    disabled: {
      type: [Boolean],
      default: false
    },
    rowHeight: Number,
    columnWidth: Number
  },
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
      if (!this.disabled) {
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
