<style lang="stylus" scoped>
.container
  flex 1.5
  border-top 1px solid
</style>

<template>
  <div
    @dragover="$event.preventDefault()" @dragenter="onDragEnter" @dragleave="onDragLeave" @drop="onDrop"
    class="container">
      <item-card v-for="(item, index) in items" :key="index" :item="item"/>
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
      this.$store.commit('dropZone/addActiveItem', Object.assign({}, this.dragged, {
        dragged: true
      }))
    },
    onDragLeave () {
      this.$store.commit('dropZone/removeActiveItem', this.dragged)
    },
    onDrop () {
      this.$store.commit('dropZone/dropActiveItem')
    }
  },
  components: {
    ItemCard
  }
}
</script>
