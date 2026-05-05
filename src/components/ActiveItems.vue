<style lang="stylus" scoped>
// Light bluish sentence strip (matches kid app reference)
$sentence-strip-bg = #e8f2fa
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
  border 2px dashed #1976d2
  font-size 2em
  color #1976d2
  position absolute
  margin 1rem
  box-sizing border-box
  // medium — match ItemCard--medium inner picto area
  width calc(170px * var(--px-scale, 1))
  height calc(168px * var(--px-scale, 1))

.active-strip--small .card-drop
  width calc(120px * var(--px-scale, 1))
  height calc(118px * var(--px-scale, 1))

.active-strip--large .card-drop
  width calc(240px * var(--px-scale, 1))
  height calc(238px * var(--px-scale, 1))
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
