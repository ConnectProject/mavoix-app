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
      tag="div" :sort="false" v-model="items" group="items"
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
      <q-btn fab icon="play_arrow" @click="onPlaySequence" color="accent" />
    </q-page-sticky>
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
    items: {
      get () {
        return this.$store.getters['dropZone/items']
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
      this.$store.dispatch('global/initTTS')
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
