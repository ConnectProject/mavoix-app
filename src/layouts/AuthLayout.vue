<template>
  <q-layout view="hHh lpR fFf">
     <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow-back-ios" />
        <q-toolbar-title>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  computed: {
    logged () {
      return this.$store.getters['auth/logged']
    }
  },
  watch: {
    logged (newValue) {
      if (newValue) {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>
