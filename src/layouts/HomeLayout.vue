<template>
  <q-layout view="hHh lpR fFf">

    <q-header
      class="text-black"
      style="background:grey"
    >
      <q-tabs
        align="left"
        indicator-color="transparent"
      >
        <q-route-tab
          v-for="(tab, index) in tabs"
          :key="index"
          :to="{ name: 'tab', params: { slug: tab.slug}}"
          style="border-radius: 24px 24px 0 0;text-transform:none"
          :style="{
            backgroundColor: tab.hexColor,
            margin: (tab.slug===activeTabName)?'1px 0 0 1px':'10px 0 1px 1px'
          }"
          :label="tab.name"
        />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import Parse from 'parse'

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
    activeTabName () {
      return this.$route.params.slug
    }
  },
  methods: {
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
    '$q.appVisible' (val) {
      if (!val) {
        this.$store.dispatch('stats/endSession')
      }
    },
    /**
     * When tabs change and at least one tab is available:
     *   If no tab is selected go to the first one
     *   Else just load the color
     */
    tabs (tabs) {
      if ((!this.$route.params.slug || !(tabs.map(t => t.slug).includes(this.$route.params.slug))) && tabs[0]) {
        this.$router.push({ name: 'tab', params: { slug: tabs[0].slug } })
      } else if (tabs[0]) {
        this.setActiveColor()
      }
    }
  },
  async mounted () {
    var currentUser = Parse.User.current()
    if (!currentUser) {
      console.log('No parse user found. Routing to auth page.')
      this.$router.push('/')
      return
    }
    localStorage.removeItem('connectSessionId')
    try {
      await this.$store.dispatch('tabs/loadAndWatch')
    } catch (e) {
      console.error(e)
      try {
        await Parse.User.logOut()
      } finally {
        this.$router.push('/')
      }
    }
    this.$store.dispatch('stats/connectConnect').then(() => {
      this.$store.dispatch('stats/startSession')
    })
    this.$store.dispatch('tts/init')
  }
}
</script>
