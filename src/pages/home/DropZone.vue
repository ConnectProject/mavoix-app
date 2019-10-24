<style lang="stylus" scoped>
</style>

<template>
  <q-page class="flex column" :style="`background-color: ${hexColor}`" style="overflow: hidden">
    <items :items="items"/>
    <active-items :items="activeItems"/>
  </q-page>
</template>

<script>
import Items from '~/components/Items'
import ActiveItems from '~/components/ActiveItems'

export default {
  name: 'PageHomeDropZone',
  computed: {
    hexColor () {
      return this.$store.getters['dropZone/hexColor']
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
      this.$store.dispatch('dropZone/init', this.$route.params.slug)
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
    onClearActiveItems () {
      this.$store.commit('dropZone/clearActiveItems')
    }
  },
  mounted () {
    this.initDropZone()
  },
  watch: {
    $route () {
      this.initDropZone()
    }
  },
  components: {
    Items,
    ActiveItems
  }
}
</script>
