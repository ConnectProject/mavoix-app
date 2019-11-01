<style lang="stylus" scoped>
.container
  position absolute
  top 0
  left 0
  bottom 30%
  display flex
  flex-direction row
  flex-wrap nowrap
  padding: 2em
  min-width 100vw
.content-container
  display flex
  flex-direction column
  justify-content space-evenly
  align-items stretch
  width 25vw
  max-height 100%
</style>

<template>
  <div
    ref="container"
    class="container"
    v-touch-pan.horizontal.prevent.mouse="handleSwipe">
    <div
      v-for="n in blocksCounts" :key="n"
      class="content-container">
      <item-card v-for="(item, index) in pageItems(n)" :key="n * index" :item="item" :onTouchEnd="onTouchEnd"/>
    </div>
  </div>
</template>

<script>
import ItemCard from './ItemCard'

export default {
  name: 'Items',
  data () {
    return {
      lastX: 0
    }
  },
  computed: {
    blocksCounts () {
      return Math.ceil(this.items.length / 2)
    }
  },
  methods: {
    handleSwipe ({ offset, isFinal }) {
      let container = this.$refs.container
      let translateVal = Math.min(0, Math.max(offset.x + this.lastX, -(container.clientWidth - window.innerWidth)))

      if (isFinal) {
        this.lastX = translateVal
      }
      container.style.transform = `translateX(${translateVal}px)`
    },
    pageItems (n) {
      n--
      return this.items.filter((_, i) => {
        return (i >= n * 2 && i < (n * 2) + 2)
      })
    }
  },
  props: [
    'items',
    'onTouchEnd'
  ],
  components: {
    ItemCard
  }
}
</script>
