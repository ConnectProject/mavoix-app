<style lang="stylus" scoped>
.card
  height fit-content
</style>

<template>
  <q-card class="col-2 card">
    <q-img :ratio="16/9" :src="item.asset.file._url" />

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
