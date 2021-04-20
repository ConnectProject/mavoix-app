<style lang="stylus" scoped>
.card-container
  position relative
  box-sizing border-box
  height 12rem
  width 10rem
.card-inside
  height 10rem
  width 8rem
  position absolute
  margin auto
  left 0
  right 0
  bottom 0
  top 0
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
  height 20%
  position relative
  vertical-align middle
  overflow hidden
.name
  position absolute
  margin auto
  font-size 1.25rem
  line-height 1.25rem
  top 0
  bottom 0
  right 0
  left 0
  height fit-content
.two-lines
  font-size .9rem
  line-height .9rem
</style>

<template>
  <div
    class="card-container"
  >
    <div
      class="card-inside"
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
        <q-card-section class="text-center">
            <span class="name" :class="labelClass" ref="text">{{ labelText }}</span>
        </q-card-section>
      </q-card>
    </div>
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
    }
  },
  data () {
    return {
      translateX: 0,
      translateY: 0,
      initialX: 0,
      initialY: 0,
      labelClass: ''
    }
  },
  computed: {
    labelText () {
      const maxSize = 35
      if (this.item.name.length > maxSize) {
        return this.item.name.substring(0, maxSize - 3) + '...'
      } else {
        return this.item.name
      }
    }
  },
  mounted () {
    this.resizeText()
  },
  watch: {
    labelText (newText) {
      this.resizeText()
    }
  },
  methods: {
    resizeText () {
      this.$nextTick(function () {
        let text = this.$refs.text
        if (text.offsetHeight > (1.25 * parseFloat(getComputedStyle(document.documentElement).fontSize))) {
          this.labelClass = 'two-lines'
        } else {
          this.labelClass = ''
        }
      })
    },
    /**
     * Handle drag item
     */
    onTouchMove (e) {
      if (!e.changedTouches && !(e.buttons === undefined ? e.which === 1 : e.buttons === 1)) {
        return
      }
      let touch = e.changedTouches ? e.changedTouches[0] : e
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
    internalOnTouchEnd (event) {
      if (this.item.available) {
        this.onTouchEnd(event, this.item, this.index)
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
