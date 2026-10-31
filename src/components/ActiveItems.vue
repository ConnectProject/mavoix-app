<style lang="stylus" scoped>
// Sentence strip, same colour as the header
$sentence-strip-bg = dimgray
// Reserve space for sticky controls (clear left, play right) so cards never sit underneath
$clear-slot-width = calc(3rem + 20px)
$play-slot-width = calc(7.25rem + 28px)

.container
  position absolute
  left 0
  display flex
  flex-direction row
  flex-wrap nowrap
  min-width 100vw
  border-top 1px solid rgba(25, 118, 210, 0.25)
  bottom 0
  height var(--strip-height, 12rem)
  background $sentence-strip-bg
  padding-left $clear-slot-width
  padding-right $play-slot-width
  box-sizing border-box

// Same shadow as the items zone (shadow-10), drawn here when the strip is above that zone
.container.lifted::before
  content ''
  position absolute
  top 0
  left 0
  right 0
  height 0
  pointer-events none
  box-shadow 0 6px 6px -3px rgba(0, 0, 0, 0.2), 0 10px 14px 1px rgba(0, 0, 0, 0.14), 0 4px 18px 3px rgba(0, 0, 0, 0.12)
  clip-path inset(0 0 -60px 0)

.content-container
  display flex
  flex-direction column
  justify-content space-evenly
  align-items stretch
  max-height 100%
  flex 0 0 auto
  width auto

.card-drop
  background transparent
  border 2px dashed white
  font-size 2em
  color white
  position absolute
  // vertically centred in the strip, like the cards (auto margins + top/bottom 0)
  top 0
  bottom 0
  margin auto 1rem
  box-sizing border-box
  // same size as ItemCard--medium
  width calc(170px * var(--px-scale, 1))
  height calc(210px * var(--px-scale, 1))

.active-strip--small .card-drop
  width calc(120px * var(--px-scale, 1))
  height calc(150px * var(--px-scale, 1))

.active-strip--large .card-drop
  width calc(240px * var(--px-scale, 1))
  height calc(300px * var(--px-scale, 1))
</style>

<template>
  <div
    ref="container"
    class="container"
    :class="activeStripClass"
    v-touch-pan.prevent.mouse="this.isDragging ? void 0 : handleScroll"
  >
    <q-card
      class="card-drop"
      ref="cardDrop"
      :style="`transform: translateX(${cardDropX}px)`"
      v-show="showCardDrop"
    >
    </q-card>
    <div
      class="content-container"
      v-for="(item, index) in items"
      :key="index + item.key"
    >
      <item-card
        :item="item"
        :index="index"
        :on-touch-end="onTouchEnd"
        :on-touch-start="onTouchStart"
        :on-touch-move="onTouchMove"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ItemCard from './ItemCard'

export default {
  name: 'ActiveItems',
  components: {
    ItemCard
  },
  data () {
    return {
      lastX: 0
    }
  },
  computed: {
    ...mapGetters('dropZone', ['activeStripClass'])
  },
  props: [
    'items',
    'onTouchEnd',
    'onTouchStart',
    'onTouchMove',
    'showCardDrop',
    'cardDropX',
    'isDragging'
  ],
  methods: {
    /**
     * Handle horizontal scroll
     */
    handleScroll ({ offset, isFinal }) {
      let container = this.$refs.container
      let translateVal = Math.min(0, Math.max(offset.x + this.lastX, -(container.clientWidth - window.innerWidth)))

      if (isFinal) {
        this.lastX = translateVal
      }
      container.style.transform = `translateX(${translateVal}px)`
    }
  },
  watch: {
    items: function (newItems, previousItems) {
      if (newItems.length < previousItems.length) {
        // ensure that scrolling is still consistent if number of active items diminushed
        this.$nextTick(function () {
          this.handleScroll({ offset: { x: 0 }, isFinal: true })
        })
      }
    }
  }
}
</script>
