<style lang="stylus" scoped>
.container
  display flex
  flex-direction row
  flex-wrap nowrap
  flex 1
.content-container
  flex 1
  display flex
  width 100vw
  justify-content flex-start
  align-items center
  max-height 100%
  flex-flow row wrap
  padding 1em
</style>

<template>
  <div
    ref="container"
    class="container"
    v-touch-pan.horizontal.prevent.mouse="handleSwipe"
    @dragenter="onDragEnter" @dragleave="onDragLeave" @drop="onDrop">
    <div
      v-for="n in blocksCounts" :key="n"
      class="content-container">
      <item-card v-for="(item, index) in pageItems(n)" :key="index" :item="item"/>
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
      return Math.ceil(this.items.length / 8)
    }
  },
  methods: {
    handleSwipe ({ offset, isFinal }) {
      let container = this.$refs.container
      let translateVal = Math.min(0, offset.x + this.lastX)

      if (isFinal) {
        this.lastX = translateVal
      }
      container.style.transform = `translateX(${translateVal}px)`
    },
    pageItems (n) {
      n--
      return this.items.filter((_, i) => {
        return (i >= n * 8 && i < (n * 8) + 8)
      })
    },
    onDragEnter () {
    },
    onDragLeave () {
    },
    onDrop () {
    }
  },
  props: [
    'items'
  ],
  components: {
    ItemCard
  }
}
</script>
