<style lang="stylus" scoped>
.page
  position relative
  width 100vw
  height 100%
</style>

<template>
  <q-page
    class="page"
    :style="`background-color: ${hexColor}`"
    style="overflow: hidden"
  >
    <!-- Available items -->
    <items
      :items="items"
      :onTouchEnd="onTouchEnd"
      :onClickEnd="onTouchEnd"
    />
    <!-- Active items -->
    <active-items
      ref="activeZone"
      :items="activeItems"
      :onTouchEnd="onTouchEnd"
      :onClickEnd="onTouchEnd"
    />
<!--       <q-btn @click="changePlay">{{ playing }}</q-btn>
 -->
    <!-- Clear active items button -->
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 85]"
    >
      <q-btn
        class="q-mx-xs"
        fab
        icon="clear"
        color="negative"
        @click="onClearActiveItems"
      />
    </q-page-sticky>
    <!-- Play active items button -->
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        class="q-mx-xs"
        fab
        :icon="playing ? 'pause' : 'play_arrow'"
        color="primary"
        @click="onPlaySequence"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import Items from '~/components/Items'
import ActiveItems from '~/components/ActiveItems'

export default {
  name: 'PageHomeDropZone',
  components: {
    Items,
    ActiveItems
  },
  data () {
    return {
      playing: false
    }
  },
  mounted () {
    this.initDropZone()
  },
  computed: {
    hexColor () {
      return this.$store.getters['dropZone/hexColor']
    },
    /**
     * Return all items except the hidden ones
     */
    items () {
      return this.$store.getters['dropZone/items'].filter((item) => item.hidden === false)
    },
    activeItems () {
      return this.$store.getters['dropZone/activeItems']
    }
  },
  methods: {
    changePlay () {
      this.playing = !this.playing
    },
    initDropZone () {
      this.$store.dispatch('dropZone/init', this.$route.params.slug)
    },
    /**
     * Tranform a list of word into a string (join array members with ` `) and send it to the text to speech plugin
     */
    onPlaySequence () {
      let sequence = ''
      this.activeItems.forEach((activeItem) => {
        sequence += `${activeItem.name} `
      })
      this.playing = true

      this.$store.dispatch('tts/speak', sequence).then(() => {
      })
    },
    onClearActiveItems () {
      this.$store.commit('dropZone/clearActiveItems')
    },
    /**
     * When stop touching screen:
     *   If touch end over the active zone drop it into it
     *   else if touch end over the list of available items drop it into it
     */
    onTouchEnd ({ changedTouches: [ touch ] }, item) {
      let zone = 'passiv'

      if (touch.pageY >= this.$refs.activeZone.$el.getBoundingClientRect().top) {
        zone = 'active'
      }
      this.$store.commit('dropZone/drop', { item, zone })
    }
  },
  watch: {
    $route () {
      this.initDropZone()
    }
  }
}
</script>
