<style lang="stylus" scoped>
.container
  position absolute
  top 0
  left 0
  bottom 30%
  display flex
  flex-direction row
  flex-wrap nowrap
  padding 1em
  min-width 100vw
  z-index 10
.content-container
  display flex
  flex-direction column
  justify-content space-evenly
  align-items stretch
  width 15vw
  max-height 100%
</style>

<template>
  <div
    ref="container"
    class="container"
    v-touch-pan.horizontal.prevent.mouse="handleScroll"
  >
    <!-- Colums of 2 items -->
    <div
      v-for="n in blocksCounts"
      :key="n"
      class="content-container"
    >
      <!-- The two items -->
      <item-card
        v-for="(item, index) in pageItems(n)"
        :key="n * index"
        :index="index"
        :item="item"
        ref="card"
        :on-touch-end="onTouchEnd"
        :on-touch-start="onTouchStart"
        :onTouchMoveProps="onTouchMoveProps"
      />
    </div>
  </div>
</template>

<script>
import ItemCard from './ItemCard'

export default {
  name: 'Items',
  props: [
    'items',
    'onTouchEnd',
    'onTouchMoveProps',
    'onTouchStart'
  ],
  components: {
    ItemCard
  },
  data () {
    return {
      lastX: 0
    }
  },
  computed: {
    /**
     * Return the number of colums
     */
    blocksCounts () {
      return Math.ceil(this.items.length / 2)
    }
  },
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
    },
    /**
     * Return array of items of a spectific column
     */
    pageItems (n) {
      n--
      return this.items.filter((_, i) => {
        return (i >= n * 2 && i < (n * 2) + 2)
      })
    }
  }
}
</script>
