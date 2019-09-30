<template>
  <q-page class="column no-wrap">
    <!-- Available items -->
    <draggable tag="div" group="items" class="q-pa-md row justify-start q-gutter-md" style="flex: 2">
      <item-card v-for="(item, index) in items" :key="index" :item="item"/>
    </draggable>

    <!-- To play items -->
    <draggable tag="div" group="items" class="q-pa-md row items-start" style="flex: 1">
      <item-card v-for="(item, index) in activeItems" :key="index" :item="item"/>
    </draggable>
  </q-page>
</template>

<script>
import Draggable from 'vuedraggable'
import ItemCard from '~/components/ItemCard'

export default {
  name: 'PageHomeDropZone',
  computed: {
    slug () {
      return this.$route.params.slug
    },
    items () {
      return this.$store.getters['dropZone/items']
    },
    activeItems () {
      return this.$store.getters['dropZone/activeItems']
    }
  },
  methods: {
    initDropZone () {
      this.$store.dispatch('dropZone/init', this.slug)
    }
  },
  mounted () {
    this.initDropZone()
  },
  watch: {
    slug () {
      this.initDropZone()
    }
  },
  components: {
    Draggable,
    ItemCard
  }
}
</script>
