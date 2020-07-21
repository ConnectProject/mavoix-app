<template>
  <q-layout view="hHh lpR fFf">

    <q-header
      class="bg-primary text-white"
      elevated
    >
      <q-tabs
        v-model="active"
        :style="`background-color: ${activeColor}; height: 4.5em`" align="center"
      >
        <q-route-tab
          v-for="(tab, index) in tabs"
          :key="index"
          :to="{ name: 'dropZone', params: { slug: tab.slug}}"
          :style="{ backgroundColor: tab.hexColor }"
          :label="tab.name" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      activeColor: 'white',
      test: 'ok'
    }
  },
  computed: {
    store () {
      return this.$store.getters['auth/invitationCode']
    },
    tabs () {
      return this.$store.getters['tabs/all']
    },
    active: {
      get () {
        return this.$store.getters['tabs/active']
      },
      set (active) {
        this.$store.commit('tabs/setActive', active)
      }
    }
  },
  methods: {
    testClick () {
      this.$store.dispatch('tabs/loadAndWatch')
      alert(this.tabs)
    },
    /**
     * Change the active color by loading the color in the right tab object
     */
    setActiveColor () {
      let tab = this.tabs.find((value) => {
        return value.slug === this.$route.params.slug
      })
      this.activeColor = tab.hexColor
    }
  },
  watch: {
    /**
     * When change route (tab) change the header color
     */
    $route () {
      this.setActiveColor()
    },
    /**
     * When tabs change and at least one tab is available:
     *   If no tab is selected go to the first one
     *   Else just load the color
     */
    tabs (tabs) {
      if (!this.$route.params.slug && tabs[0]) {
        this.$router.push({ name: 'dropZone', params: { slug: tabs[0].slug } })
      } else if (tabs[0]) {
        this.setActiveColor()
      }
    }
  },
  mounted () {
    this.$store.dispatch('tabs/loadAndWatch')
    this.$store.dispatch('tts/init')
  }
}
</script>
