<style lang="stylus" scoped>
.page
  position relative
  width 100vw
  height calc(100vh - 60px)
  overflow hidden
  background grey
</style>

<template>
  <q-page
    class="page"
    ref="page"
  >

    <!-- Available items -->
    <items
      class="shadow-10"
      ref="itemsZone"
      :items="items"
      :style="`background-color: ${hexColor}`"
      :on-touch-end="onTouchEnd"
      :on-touch-start="onTouchStart"
      :onTouchMoveProps="onTouchMoveProps"
    />
    <!-- Active items -->
    <active-items
      ref="activeZone"
      :items="activeItems"
      :on-touch-end="onTouchEndActive"
      :on-touch-start="onTouchStartActive"
      :onTouchMoveProps="onTouchMoveProps"
    />

    <!-- Clear active items button -->
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 85]"
    >
      <q-btn
        class="q-mx-xs"
        fab
        icon="clear"
        color="negative"
        @click="onClearActiveItems"
      />
    </q-page-sticky>

    <!-- Play active items button -->
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        class="q-mx-xs"
        fab
        :icon="$store.state.tts.playing ? 'pause' : 'play_arrow'"
        color="primary"
        @click="onPlaySequence"
      />
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
      index: 0,
      active: false,
      rows: 1,
      columns: 1,
      triggered: false
    }
  },
  mounted () {
    this.initDropZone()
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
      let sequence = ''
      this.activeItems.forEach((activeItem) => {
        sequence += `${activeItem.name} `
      })
      this.$store.dispatch('tts/speak', sequence).then(() => {
        this.$store.dispatch('dropZone/saveSentence')
      })
    },
    onClearActiveItems () {
      this.$store.commit('dropZone/clearActiveItems')
    },
    /**
     * When stop touching screen:
     *   If touch end over the active zone drop it into it
     *   else if touch end over the list of available items drop it into it
     */
    onTouchEnd ($event, item) {
      if (!item.active) {
        this.$refs.itemsZone.$el.style.zIndex = '0'
        $event.target.closest('.card').style.zIndex = '0'
        let position = this.index
        // check whether we are in the active or passive zone to know what to do:
        let zone = 'passiv'
        let touch = $event.changedTouches[0]
        if (touch.pageY >= this.$refs.activeZone.$el.getBoundingClientRect().top) {
          zone = 'active'
        }
        this.$store.commit('dropZone/drop', { item, position, zone })
        this.active = false
      }
    },
    // put the active element to its new place
    onTouchEndActive ($event, item, index) {
      // first reset it to its prior state
      this.$refs.activeZone.$el.style.touchAction = 'auto'
      this.$refs.activeZone.$el.style.zIndex = '0'
      $event.target.closest('.card').style.zIndex = '0'
      // whether it was initially before or after where it has been drop determines it new position in the array
      let pos = this.index
      if (index < this.index) {
        pos = pos - 1
      }
      let position = Math.max(0, pos)
      // check whether we are in the active or passive zone to know what to do:
      let zone = 'passiv'
      let touch = $event.changedTouches[0]
      if (touch.pageY >= this.$refs.activeZone.$el.getBoundingClientRect().top) {
        zone = 'active'
      }
      this.$store.commit('dropZone/drop', { item, position, zone })
      this.active = false
      // reset element from the active zone
      this.resetAllElement()
    },
    // when starting to drag an element from the top part, make it over the others, not below
    onTouchStart ($event, item, index) {
      if (!item.active) {
        this.$refs.itemsZone.$el.style.zIndex = '50'
        $event.target.closest('.card').style.zIndex = '50'
        this.active = false
      }
    },
    // when starting to drag an element from the active part, make it over the others, not below
    onTouchStartActive ($event, item, index) {
      this.$refs.activeZone.$el.style.zIndex = '50'
      this.$refs.activeZone.$el.style.touchAction = 'none'
      $event.target.closest('.card').style.zIndex = '50'
      this.active = true
      this.resetAllElement()
    },
    retrieveDragCardPosition (touch, cards) {
      // we are know trying to find "i" where is the index of the card our dragged item is over
      let i = 0
      if (cards[i] && touch.pageX > cards[i].getBoundingClientRect().right - (cards[i].closest('.content-container').getBoundingClientRect().width / 2)) {
        while (cards[i] && cards[i].getBoundingClientRect().right - (cards[i].closest('.content-container').getBoundingClientRect().width / 2) < touch.pageX) {
          i++
        }
      }
      return i
    },
    translateToLeft (start, end, index, cardsEl) {
      // translate those element to the left so it doesn't show a hole in place of the dragged element
      for (let j = start; j < end; j++) {
        if (j !== index) {
          cardsEl[j].closest('.content-container').style.transform = 'translate(-' + (cardsEl[j].closest('.content-container').offsetWidth) + 'px , 0px)'
        }
      }
    },
    onTouchMoveProps (touch, item, index) {
      // is pointer in the active zone ?
      if (touch.pageY >= this.$refs.activeZone.$el.getBoundingClientRect().top) {
        let cards = this.$refs.activeZone.$el.getElementsByClassName('card')
        let cardsEl = this.$refs.activeZone.$el.getElementsByClassName('card-item')
        let i = this.retrieveDragCardPosition(touch, cards)
        this.index = Math.min(i, cards.length)
        if (!this.active) {
          // we come from the resources part, just have to include a "fake" card in the set from the store
          this.$store.commit('dropZone/move', this.index)
        } else {
          // reinit cards to choose the one to modify
          this.resetAllElement()
          // when moving an element it leave a blank space that we need to remove
          // it can be to its left or to its right, hence this two cases
          if (this.index < cards.length) {
            if (this.index > index) {
              this.translateToLeft(index, this.index, index, cardsEl)
            // second case:
            } else {
              let start = this.index
              let end = index
              for (let j = start; j < end; j++) {
                if (j !== index) {
                  cardsEl[j].style.transform = 'translateX(' + (cardsEl[j].closest('.content-container').offsetWidth) + 'px)'
                }
              }
            }
            // if the hovered index is not our dragged element index, show a dotted drop space to its left (this class adds a pseudo element)
            if (index !== i && cardsEl[i]) {
              cardsEl[i].closest('.content-container').classList.add('next-card')
            }
          } else {
            this.translateToLeft(
              Math.min(index, this.index),
              Math.max(index, this.index),
              index,
              cardsEl
            )
            // if the dragged element is the last of the list, add to the one prior to it
            // a dotted drop space to its right
            if (index === cards.length - 1) {
              if (cards.length > 1) {
                cardsEl[cards.length - 2].closest('.content-container').classList.add('next-card-last')
              }
            // else do that on the last element
            } else {
              cardsEl[cards.length - 1].closest('.content-container').classList.add('next-card-last')
            }
          }
        // know we are treating the edge case that happen when i is greater than the number of active items
        }
      // we are not on the active zone, we can reset the element
      } else {
        this.resetAllElement()
      }
    },
    // reset active elements
    resetAllElement () {
      if (this.$refs.activeZone.$refs.card) {
        let cardEls = this.$refs.activeZone.$refs.card
        for (let j = 0; j < cardEls.length; j++) {
          cardEls[j].$el.style.transform = 'none'
          cardEls[j].$el.closest('.content-container').style.transform = 'none'
          cardEls[j].$el.closest('.content-container').classList.remove('next-card')
          cardEls[j].$el.closest('.content-container').classList.remove('next-card-last')
          cardEls[j].$el.style.marginLeft = '0px'
        }
      }
    }
  },
  watch: {
    $route () {
      this.initDropZone()
    }
  }
}
</script>
