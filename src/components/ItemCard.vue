<style lang="stylus" scoped>
.card
  background white
  position relative
  height 10rem
  width 8rem
  margin 1rem

.picto
  height 80%

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
  user-select none

.two-lines
  font-size .9rem
  line-height .9rem
</style>

<template>
  <q-card
    ref="card"
    class="card"
    :style="`transform: translate(${translateX}px, ${translateY}px)`"
    v-touch-pan.prevent.mouse="disabled ? void 0 : handleDrag"
    v-on="{ click: translateX || translateY ? () => {} : handleClick }"
  >
    <q-img
      :src="item.asset.url"
      class="picto"
      draggable="false"
      contain
    >
      <div
        v-if="disabled"
        class="card-img-wrapper"
      >
        <q-img
          src="../assets/Indisponible-symbol.svg"
          draggable="false"
        />
      </div>
    </q-img>
    <q-card-section class="text-center">
      <span
        class="name"
        :class="labelClass"
        ref="text"
      >{{ labelText }}</span>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'ItemCardComponent',
  props: {
    item: Object,
    index: Number,
    onTouchEnd: Function,
    onTouchStart: Function,
    onTouchMove: Function,
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
    labelText () {
      this.resizeText()
    }
  },
  methods: {
    resizeText () {
      this.$nextTick(function () {
        let text = this.$refs.text
        if (text.scrollHeight > text.parentElement.clientHeight ||
          text.scrollWidth > text.clientWidth) {
          this.labelClass = 'two-lines'
        } else {
          this.labelClass = ''
        }
      })
    },
    resetTranslation () {
      this.translateX = 0
      this.translateY = 0
    },
    /**
     * Handle drag item
     */
    handleDrag ({ offset, isFirst, isFinal }) {
      if (isFirst) {
        // Set the card initial position (should be 0 unless something went wrong)
        this.initialX = this.translateX
        this.initialY = this.translateY
        this.onTouchStart(this)
      }
      // Translate the card to the new mouse position
      this.translateX = this.initialX + offset.x
      this.translateY = this.initialY + offset.y
      this.onTouchMove(this)
      if (isFinal) {
        // Call the prop's callback and reset data
        this.onTouchEnd(this)
      }
    },
    // /**
    //  * When clicking on card:
    //  *   toggle card between active and passive zone
    //  */
    handleClick () {
      const zone = this.item.active ? 'passiv' : 'active'
      this.onTouchEnd(this, zone)
    }
  }
}
</script>
