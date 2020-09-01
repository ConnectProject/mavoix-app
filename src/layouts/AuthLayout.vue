<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      class="bg-primary text-white"
      elevated
    >
      <q-toolbar>
        <q-toolbar-title>
          Ma voix
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
  mounted () {
    this.$store.commit('auth/logout')
  },
  watch: {
    /**
     * When the user is logged go to home page
     */
    logged (newValue) {
      if (newValue) {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>
