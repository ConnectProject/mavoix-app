<template>
  <q-page class="column">
    <!-- Available items -->
    <draggable>
    </draggable>

    <!-- To play items -->
    <draggable>
    </draggable>
  </q-page>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'PageHomeDropZone',
  computed: {
    slug () {
      return this.$route.params.slug
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
    Draggable
  }
}
</script>
