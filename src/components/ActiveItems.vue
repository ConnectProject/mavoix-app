<style lang="stylus" scoped>
.container
  position absolute
  left 0
  display flex
  flex-direction row
  flex-wrap nowrap
  min-width 100vw
  border-top 1px solid black
  bottom 0
  height 12rem

.content-container
  display flex
  flex-direction column
  justify-content space-evenly
  align-items stretch
  max-height 100%
  width 10 rem

.card-drop
  background transparent
  border 2px dotted white
  font-size 2em
  color white
  position absolute
  height 10rem
  width 8rem
  margin 1rem
</style>

<template>
  <div
    ref="container"
    class="container"
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
