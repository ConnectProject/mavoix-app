<style lang="stylus" scoped>
.page
  position relative
  width 100vw
  height calc(100vh - 60px)
  overflow hidden
  background grey

// Clear control — flush left on the sentence strip
.clear-strip-btn
  width 3rem
  height 3rem
  min-width 3rem
  min-height 3rem
  border-radius 8px
  background #fff
  color #1976d2
  box-shadow 0 2px 8px rgba(25, 118, 210, 0.35)

// Large play control: rainbow conic ring + white frame; inner disk dark blue when pressed / speaking
.sentence-play-btn
  position relative
  display flex
  align-items center
  justify-content center
  width 7.25rem
  height 7.25rem
  padding 0
  border none
  border-radius 50%
  background transparent
  cursor pointer
  outline none
  -webkit-tap-highlight-color transparent
  // Soft float + outer white cushion (neumorphic frame)
  filter drop-shadow(0 5px 14px rgba(0, 0, 0, 0.12))

  &__ring
    position absolute
    inset 0
    border-radius 50%
    z-index 0
    pointer-events none
    // Full rainbow ring: red → orange → yellow → green → cyan → blue → violet → red
    background conic-gradient(
      from -90deg,
      #e53935 0deg,
      #fb8c00 51deg,
      #fdd835 102deg,
      #7cb342 154deg,
      #26c6da 205deg,
      #1e88e5 257deg,
      #8e24aa 308deg,
      #e53935 360deg
    )
    // White rim outside color + soft tinted glow
    box-shadow 0 0 0 5px #fff,
      0 0 28px rgba(251, 140, 0, 0.35),
      0 0 36px rgba(30, 136, 229, 0.28)

  &__inner
    position relative
    z-index 1
    display flex
    align-items center
    justify-content center
    width 5.35rem
    height 5.35rem
    border-radius 50%
    background #fff
    color #1976d2
    transition background 0.12s ease, color 0.12s ease
    // Crisp white ring between gradient and center (reference mockup)
    box-shadow 0 0 0 3px #fff,
      inset 0 2px 4px rgba(255, 255, 255, 0.95),
      inset 0 -2px 6px rgba(0, 0, 0, 0.06)

  &:active .sentence-play-btn__inner,
  &--playing .sentence-play-btn__inner
    background #0d47a1
    color #fff
    box-shadow 0 0 0 3px #fff,
      inset 0 2px 6px rgba(0, 0, 0, 0.15)

  &:disabled
    filter grayscale(0.25) opacity(0.55)
    cursor not-allowed

  &:disabled &__inner
    background #f0f4f8
    color #90a4ae

  &:disabled:active .sentence-play-btn__inner
    background #f0f4f8
    color #90a4ae
    box-shadow 0 0 0 3px #fff,
      inset 0 2px 4px rgba(255, 255, 255, 0.95),
      inset 0 -2px 6px rgba(0, 0, 0, 0.06)
</style>

<template>
  <q-page
    class="page"
    ref="page"
    :style="{ '--strip-height': stripHeightRem + 'rem' }"
  >

    <!-- Available items -->
    <items
      class="shadow-10"
      ref="itemsZone"
      :items="items"
      :style="`background-color: ${hexColor}`"
      :on-touch-end="onTouchEnd"
      :on-touch-start="onTouchStart"
      :on-touch-move="onTouchMove"
      :isDragging="!!card"
    />
    <!-- Active items -->
    <active-items
      ref="activeZone"
      :items="activeItems"
      :on-touch-end="onTouchEnd"
      :on-touch-start="onTouchStart"
      :on-touch-move="onTouchMove"
      :show-card-drop="true"
      :card-drop-x="cardDropX"
      :isDragging="!!card"
    />

    <!-- Clear active items — dedicated lane (strip has matching padding-left) -->
    <q-page-sticky
      position="bottom-left"
      :offset="clearStickyOffset"
    >
      <q-btn
        unelevated
        dense
        no-wrap
        color="white"
        text-color="primary"
        class="clear-strip-btn"
        icon="clear"
        @click="onClearActiveItems"
      />
    </q-page-sticky>

    <!-- Play sequence — sized & offset to sit on vertical center of 12rem strip -->
    <q-page-sticky
      position="bottom-right"
      :offset="playStickyOffset"
    >
      <button
        type="button"
        class="sentence-play-btn"
        :class="{ 'sentence-play-btn--playing': playing && canPlaySentence }"
        :disabled="!canPlaySentence"
        :aria-label="!canPlaySentence ? 'Play sentence — add pictures to the strip first' : (playing ? 'Pause' : 'Play sentence')"
        @click="onPlaySequence"
      >
        <span
          class="sentence-play-btn__ring"
          aria-hidden="true"
        />
        <span class="sentence-play-btn__inner">
          <q-icon
            :name="playing && canPlaySentence ? 'pause' : 'play_arrow'"
            size="xl"
          />
        </span>
      </button>
    </q-page-sticky>
  </q-page>
</template>

<script>
import Items from '~/components/Items'
import ActiveItems from '~/components/ActiveItems'

export default {
  name: 'PageHomeDropZone',
  components: {
    Items,
    ActiveItems
  },
  data () {
    return {
      pageX: 0,
      pageY: 0,
      active: false,
      rows: 1,
      columns: 1,
      triggered: false,
      card: null,
      cardEls: []
    }
  },
  mounted () {
    this.initDropZone()
    this.updateCardEls()
  },
  computed: {
    hexColor () {
      return this.$store.getters['dropZone/hexColor']
    },
    // language () {
    //   return this.$store.getters['dropZone/language']
    // },
    // speed () {
    //   return this.$store.getters['dropZone/speed']
    // },
    playing () {
      return this.$store.getters['tts/playing']
    },
    /**
     * Return all items except the hidden ones
     */
    items () {
      return this.$store.getters['dropZone/items'].filter((item) => item.hidden === false)
    },
    activeItems () {
      return this.$store.getters['dropZone/activeItems']
    },
    canPlaySentence () {
      return this.activeItems.length > 0
    },
    /**
     * Sentence strip height (cards + margin); must fit ItemCard--* heights.
     */
    stripHeightRem () {
      const k = this.$store.getters['dropZone/imageSizeKey']
      if (k === 'large') {
        return 21
      }
      if (k === 'small') {
        return 11.5
      }
      return 15.25
    },
    /** Vertical center of strip for 7.25rem play FAB */
    playStickyOffset () {
      const stripPx = this.stripHeightRem * 16
      const btnPx = 7.25 * 16
      return [20, Math.max(8, Math.round(stripPx / 2 - btnPx / 2))]
    },
    /** Vertical center for 3rem clear button */
    clearStickyOffset () {
      const stripPx = this.stripHeightRem * 16
      const btnPx = 3 * 16
      return [10, Math.max(8, Math.round(stripPx / 2 - btnPx / 2))]
    },
    dragIndex () {
      // we are now trying to find "i" where is the index of the card our dragged item is over
      // if we are not in the active zone, consider we want to drop at the far right
      if (this.card && this.active) {
        for (let i = 0; i < this.cardEls.length; i++) {
          if (this.pageX < this.cardEls[i].closest('.content-container').getBoundingClientRect().right) {
            return i
          }
        }
      }
      // if no drag position was found, we are at the far right
      let i = this.card && this.card.item.active ? this.cardEls.length - 1 : this.cardEls.length
      return i
    },
    cardDropX () {
      if (this.dragIndex > 0) {
        const el = this.cardEls[this.dragIndex - 1].closest('.content-container')
        return el.offsetLeft + el.offsetWidth
      } else {
        return 0
      }
    }
  },
  methods: {
    initDropZone () {
      this.$store.dispatch('dropZone/init', this.$route.params.slug)
    },
    /**
     * Tranform a list of word into a string (join array members with ` `) and send it to the text to speech plugin
     */
    onPlaySequence () {
      if (!this.canPlaySentence) {
        return
      }
      let sequence = ''
      this.activeItems.forEach((activeItem) => {
        sequence += `${activeItem.name} `
      })
      const trimmed = sequence.trim()
      if (!trimmed) {
        return
      }
      this.$store.dispatch('tts/speak', trimmed).then(() => {
        this.$store.dispatch('stats/saveSentence')
      })
    },
    onClearActiveItems () {
      this.$store.dispatch('tts/cancel')
      this.$store.commit('dropZone/clearActiveItems')
    },
    // when starting to drag an element from a zone, make it over the others, not below
    onTouchStart (card) {
      this.$refs.itemsZone.$el.style.zIndex = card.item.active ? '0' : '50'
      this.$refs.activeZone.$el.style.zIndex = card.item.active ? '50' : '0'
      card.$el.style.zIndex = '50'
    },
    onTouchMove (card) {
      this.card = card
      const rect = card.$el.getBoundingClientRect()
      this.pageX = rect.left + rect.width / 2
      this.pageY = rect.top + rect.height / 2
      const cardDrop = this.$refs.activeZone.$refs.cardDrop
      // is pointer in the active zone ?
      if (this.pageY >= this.$refs.activeZone.$el.getBoundingClientRect().top) {
        this.active = true
        card.$el.style['box-shadow'] = 'blue 0px 0px 5px 2px'
        cardDrop.$el.style['box-shadow'] = 'blue 0px 0px 5px 2px'
      } else {
        this.active = false
        card.$el.style['box-shadow'] = null
        cardDrop.$el.style['box-shadow'] = null
      }
      this.$nextTick(this.translateActiveCards)
    },
    /**
     * When stop touching screen:
     *   If touch end over the active zone drop it into it
     *   else if touch end over the list of available items drop it into it
     */
    onTouchEnd (card, zone) {
      // first reset it to its prior state
      this.$refs.itemsZone.$el.style.zIndex = '0'
      this.$refs.activeZone.$el.style.zIndex = '0'
      card.$el.style.zIndex = '0'
      card.$el.style['box-shadow'] = null
      this.$refs.activeZone.$refs.cardDrop.$el.style['box-shadow'] = null
      card.resetTranslation()

      // check whether we are in the active or passive zone to know what to do:
      zone = zone || (this.active ? 'active' : 'passiv')
      const item = card.item
      let position = this.dragIndex
      this.card = null
      this.$store.commit('dropZone/dropItem', { item, position, zone })
    },
    translateActiveCards () {
      // if the card comes from the resources part, we consider its previous postition to be the last one
      let index = this.cardEls.length
      if (!this.card) {
        return
      }
      if (this.card.item.active) {
        // else we take its postion in the active zone
        index = this.card.index
      }
      for (let j = 0; j < Math.min(this.dragIndex, index); j++) {
        this.cardEls[j].style.transform = 'translateX(0px)'
      }
      // when moving an element it leave a blank space that we need to remove
      // it can be to its left or to its right, hence this two cases
      if (this.dragIndex <= index) {
        // first case: the place we want to drop is more at the left
        // translate to right all the elements between the two places
        for (let j = this.dragIndex; j < index; j++) {
          this.cardEls[j].style.transform = `translateX(${this.cardEls[j].closest('.content-container').offsetWidth}px`
        }
      } else {
        // second case: the place we want to drop is further than where the items comes from
        // translate to left all the elements between those two places
        for (let j = index + 1; j <= this.dragIndex; j++) {
          this.cardEls[j].style.transform = `translateX(-${this.card.$el.closest('.content-container').offsetWidth}px`
        }
      }
      for (let j = Math.max(this.dragIndex, index) + 1; j < this.cardEls.length; j++) {
        this.cardEls[j].style.transform = 'translateX(0px)'
      }
    },
    updateCardEls () {
      this.$nextTick(function () {
        this.cardEls = [...this.$refs.activeZone.$el.getElementsByClassName('card')]
      })
    }
  },
  watch: {
    $route () {
      this.initDropZone()
    },
    activeItems () {
      this.updateCardEls()
    }
  }
}
</script>
