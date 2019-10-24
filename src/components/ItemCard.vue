<style lang="stylus" scoped>
.card
  height fit-content
  width 20%
  margin: 0 2em
.card-img-wrapper
  height 100%
  width 100%
  display flex
  justify-content center
  align-items center
  & img
    width 80%
    height 80%
.circle:before
  content '\25CF'
  font-size 100%
  color red
</style>

<template>
  <q-card
    class="card" :style="`opacity: ${dragged ? 0.1 : 1}`"
    :draggable="item.available" v-on:dragstart="onDragStart" v-on:dragend="onDragEnd"
    :disabled="!item.available">
    <q-img :ratio="1.8" :src="item.asset.file._url">
      <div class="card-img-wrapper" v-if="!item.available">
        <img src="../assets/red_circle.svg"/>
      </div>
    </q-img>

    <q-card-section>
      <div class="text-h6 text-center">{{ item.name }}</div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'ItemCardComponent',
  data () {
    return {
      dragged: false
    }
  },
  methods: {
    onDragStart () {
      this.$store.commit('dropZone/setDragged', this.item)
      this.dragged = true
    },
    onDragEnd () {
      this.$store.commit('dropZone/setDragged', null)
      this.dragged = false
    }
  },
  watch: {
    item (newValue) {
      if (newValue.dragged) this.dragged = true
      else this.dragged = false
    }
  },
  mounted () {
    if (this.item.dragged) this.dragged = true
  },
  props: [
    'item'
  ]
}
</script>
