<style lang="stylus" scoped>
.page
  position relative
  width 100vw
  height 100%
</style>

<template>
  <q-page class="page" :style="`background-color: ${hexColor}`" style="overflow: hidden">
    <items :items="items" :onTouchEnd="onTouchEnd"/>
    <active-items ref="activeZone" :items="activeItems" :onTouchEnd="onTouchEnd"/>

    <q-page-sticky position="bottom-right" :offset="[18, 85]">
      <q-btn class="q-mx-xs" fab icon="clear" color="negative" @click="onClearActiveItems" />
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn class="q-mx-xs" fab icon="play_arrow" color="primary" @click="onPlaySequence" />
    </q-page-sticky>
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
    items () {
      return this.$store.getters['dropZone/items'].filter((item) => item.hidden === false)
    },
    activeItems () {
      return this.$store.getters['dropZone/activeItems']
    }
  },
  methods: {
    initDropZone () {
      this.$store.dispatch('dropZone/init', this.$route.params.slug)
    },
    onPlaySequence () {
      let sequence = ''

      this.activeItems.forEach((activeItem) => {
        sequence += `${activeItem.name} `
      })

      this.$store.dispatch('tts/speak', sequence)
    },
    onClearActiveItems () {
      this.$store.commit('dropZone/clearActiveItems')
    },
    onTouchEnd ({ changedTouches: [ touch ] }, item) {
      let zone = 'passiv'

      if (touch.pageY >= this.$refs.activeZone.$el.getBoundingClientRect().top) {
        zone = 'active'
      }
      this.$store.commit('dropZone/drop', { item, zone })
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
