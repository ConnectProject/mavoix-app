<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Title
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab v-for="(tab, index) in tabs" :key="index" :to="{ name: 'dropZone', params: { slug: tab.slug}}" :label="tab.name" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  computed: {
    tabs () {
      return this.$store.getters['tabs/all']
    }
  },
  mounted () {
    this.$store.dispatch('tabs/loadAndWatch')
  }
}
</script>
