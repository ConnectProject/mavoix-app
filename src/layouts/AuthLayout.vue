<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      class="bg-primary text-white"
      elevated
    >
      <q-toolbar>
        <q-btn  stretch flat class="q-mr-sm">
          Ma voix
        </q-btn>
        <q-separator dark vertical inset v-if="$route.path !== '/'" />
        <q-btn stretch flat label="back" v-if="$route.path !== '/'" @click="$router.push({ name: 'auth' })" />
        <q-space />
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
