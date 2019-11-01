<style lang="stylus" scoped>
.container
  position absolute
  bottom 0
  left 0
  right 0
  top 70%
  display flex
  flex-direction row
  align-items center
  border-top 1px solid
  height 30%
  padding 2em
  padding-right 6em
.item-container
  width 25vw
</style>

<template>
  <div
    @dragover="$event.preventDefault()" @dragenter="onDragEnter" @dragleave="onDragLeave" @drop="onDrop"
    class="container">
      <div class="item-container" v-for="(item, index) in items" :key="index">
        <item-card :item="item" />
      </div>
  </div>
</template>

<script>
import ItemCard from './ItemCard'

export default {
  name: 'ActiveItems',
  props: [
    'items'
  ],
  computed: {
    dragged () {
      return this.$store.getters['dropZone/dragged']
    }
  },
  methods: {
    onDragEnter () {
      this.$store.commit('dropZone/setDraggedOver', 'active')
    },
    onDragLeave () {
    },
    onDrop () {
      this.$store.commit('dropZone/dropDragged')
    }
  },
  components: {
    ItemCard
  }
}
</script>
