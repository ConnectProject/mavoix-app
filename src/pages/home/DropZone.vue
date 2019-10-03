<style lang="stylus" scoped>
.items-container
  position absolute
  top 0
  left 0
  right 0
  bottom 30%

.active-items-container
  position absolute
  top: 70%
  left 0
  right 0
  bottom  0
  border-top 1px solid black
</style>

<template>
  <q-page style="overflow-y: hidden">
    <!-- Available items -->
    <draggable
      tag="div" :sort="false" v-model="items" group="items" @sort="onDragEnd"
      class="q-pa-md row q-gutter-md items-container"
    >
      <item-card v-for="(item, index) in items" :key="index" :item="item"/>
    </draggable>

    <!-- To play items -->
    <draggable
      tag="div" v-model="activeItems" group="items"
      class="q-pa-md row q-gutter-x-md active-items-container"
    >
      <item-card v-for="(item, index) in activeItems" :key="index" :item="item"/>
    </draggable>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <div class="column">
        <q-btn fab icon="play_arrow" @click="onPlaySequence" color="primary" />
        <q-btn fab icon="delete" @click="onClearActiveItems" color="negative" />
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { colors } from 'quasar'
import Draggable from 'vuedraggable'
import ItemCard from '~/components/ItemCard'

export default {
  name: 'PageHomeDropZone',
  computed: {
    slug () {
      return this.$route.params.slug
    },
    items: {
      get () {
        return this.$store.getters['dropZone/items'].filter((item) => item.hidden === false)
      },
      set (value) {
        this.$store.commit('dropZone/setItemsRaw', value)
      }
    },
    activeItems: {
      get () {
        return this.$store.getters['dropZone/activeItems']
      },
      set (value) {
        this.$store.commit('dropZone/setActiveItems', value)
      }
    },
    tts () {
      if (this.$store.getters['global/ttsEnabled']) {
        return this.$store.getters['global/tts']
      }
      return null
    }
  },
  methods: {
    initDropZone () {
      this.$store.dispatch('dropZone/init', this.slug)
    },
    onPlaySequence () {
      if (this.tts) {
        let sequence = ''

        this.activeItems.forEach((activeItem) => {
          sequence += `${activeItem.name} `
        })

        this.tts.speak({ text: sequence })
      } else {
        alert('Error tts not loaded')
      }
    },
    onDragEnd () {
      this.$store.commit('dropZone/sortItems')
    },
    onClearActiveItems () {
      this.$store.commit('dropZone/clearActiveItems')
    }
  },
  mounted () {
    this.initDropZone()
  },
  watch: {
    slug () {
      this.initDropZone()
    },
    tab (newValue, oldValue) {
      if (newValue) {
        colors.setBrand('primary', this.tab.hexColor)
      }
    }
  },
  components: {
    Draggable,
    ItemCard
  }
}
</script>
