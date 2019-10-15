<style lang="stylus" scoped>
.card
  height fit-content
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
  <q-card class="col-2 card" :disabled="!item.available">
    <q-img :ratio="1" :src="item.asset.file._url">
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
  props: [
    'item'
  ]
}
</script>
