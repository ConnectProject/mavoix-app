<style lang="stylus" scoped>
.container
  position absolute
  top 70%
  left 0
  height 30%
  display flex
  flex-direction row
  flex-wrap nowrap
  padding: 2em
  min-width 100vw
  border-top 1px solid black
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
    v-touch-pan.horizontal.prevent.mouse="handleScroll"
  >
      <div
        class="content-container"
        v-for="(item, index) in items"
        :key="index"
      >
        <item-card
          :item="item"
          :onTouchEnd="onTouchEnd"
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
    'onTouchEnd'
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
  }
}
</script>
