<template>
  <div>
  </div>
</template>

<script>
export default {
  name: 'PageHomeDropZone',
  computed: {
    slug () {
      return this.$route.params.slug
    }
  },
  watch: {
    slug () {
      this.initDropZone()
    }
  },
  methods: {
    initDropZone () {
      this.$store.dispatch('dropZone/init', this.slug)
    }
  },
  mounted () {
    this.initDropZone()
  }
}
</script>
