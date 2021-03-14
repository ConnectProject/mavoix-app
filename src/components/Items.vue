<style lang="stylus" scoped>
.container
  position absolute
  left 0
  display flex
  flex-direction row
  flex-wrap nowrap
  min-width 100vw
  z-index 10
  top 0px
.content-container
  display flex
  flex-direction column
  justify-content flex-start
  align-items stretch
  max-height 100%
.active-card
  opacity 0
</style>

<template>
  <div
    ref="container"
    class="container"
    v-touch-pan.horizontal.prevent.mouse="handleScroll"
    :style="{ height: (rowHeight * (rows - 1)) + 'px' }"
  >
    <!-- Colums of x items -->
    <div
      v-for="n in blocksCounts(items,rows)"
      :key="n"
      class="content-container"
    >
      <!-- The two items -->
      <item-card
        v-for="(item, index) in pageItems(n, items, rows)"
        :key="n * index"
        :index="index"
        :item="item"
        :rowHeight='rowHeight'
        :columnWidth='columnWidth'
        :class="item.active ? 'active-card' : ''"
        ref="card"
        :on-touch-end="onTouchEnd"
        :on-touch-start="onTouchStart"
        :onTouchMoveProps="onTouchMoveProps"
        :disabled="!item.available || item.active"
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
    'onTouchStart',
    'rowHeight',
    'rows',
    'columnWidth',
    'columns'
  ],
  components: {
    ItemCard
  },
  data () {
    return {
      lastX: 0
    }
  },
  methods: {
    /**
     * Return the number of colums
     */
    blocksCounts (items, rows) {
      if (items.length) {
        return Math.ceil(items.length / (rows - 1))
      } else {
        return 0
      }
    },
    /**
     * Handle horizontal scroll
     */
    handleScroll ({ evt, offset, isFinal }) {
      let scrolledElement = evt.target.closest('.card-container')
      console.log(scrolledElement && scrolledElement.classList.contains('active-card'))
      if ((scrolledElement && scrolledElement.classList.contains('active-card')) || (event.target.classList.contains('card-container'))) {
        let container = this.$refs.container
        let translateVal = Math.min(0, Math.max(offset.x + this.lastX, -(container.clientWidth - window.innerWidth)))

        if (isFinal) {
          this.lastX = translateVal
        }
        container.style.transform = `translateX(${translateVal}px)`
      }
    },
    /**
     * Return array of items of a spectific column
     */
    pageItems (n, items, rows) {
      n--
      return items.filter((_, i) => {
        return (i >= n * (rows - 1) && i < (n * (rows - 1)) + (rows - 1))
      })
    }
  }
}
</script>
