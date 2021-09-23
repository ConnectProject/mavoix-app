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
      let sequence = ''
      this.activeItems.forEach((activeItem) => {
        sequence += `${activeItem.name} `
      })
      this.$store.dispatch('tts/speak', sequence).then(() => {
        this.$store.dispatch('stats/saveSentence')
      })
    },
    onClearActiveItems () {
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
