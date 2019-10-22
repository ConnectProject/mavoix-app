<style lang="stylus" scoped>
.container
  flex 1.5
  border-top 1px solid
</style>

<template>
  <div class="container">
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
  components: {
    ItemCard
  }
}
</script>
