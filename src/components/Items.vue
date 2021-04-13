<style lang="stylus" scoped>
.container
  position absolute
  left 0
  width 100%
  height calc(calc(100vh - 12rem) - 60px)
  z-index 10
  top 0px
.force-portait .container
  height calc(calc(100vw - 12rem) - 60px)
.inner-container
  height 100%
  width 100%
  display inline-flex
  flex-direction column
  align-items stretch
  align-content baseline
  flex-wrap wrap
.active-card
  opacity 0
</style>

<template>
  <div
    ref="container"
    class="container"
    v-touch-pan.horizontal.prevent.mouse="handleScroll"
  >
    <div
      class="inner-container"
      ref="innerContainer"
    >
      <item-card
        v-for="(item, index) in items"
        :key="index"
        :index="index"
        :item="item"
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
  watch: {
    items (newVal, oldVal) {
      if (!oldVal[0] || newVal[0].key !== oldVal[0].key) {
        this.$refs.innerContainer.style.transform = 'translateX(0px)'
      }
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
      let scrolledElement = evt.target.closest('.card-inside')
      if (!scrolledElement || scrolledElement.closest('.active-card')) {
        let innerContainer = this.$refs.innerContainer
        let lastCard = document.querySelectorAll('.inner-container .card-container')[document.querySelectorAll('.inner-container .card-container').length - 1]
        let translateVal = Math.min(0, Math.max(offset.x + this.lastX, -(lastCard.offsetLeft + lastCard.offsetWidth - window.innerWidth)))

        if (isFinal) {
          this.lastX = translateVal
        }
        innerContainer.style.transform = `translateX(${translateVal}px)`
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
