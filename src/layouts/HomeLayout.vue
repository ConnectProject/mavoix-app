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
import { LocalStorage } from 'quasar'

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
    logged () {
      return this.$store.getters['auth/logged']
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
    logged (n, o) {
      if (n) {
        console.log('mounted')
        console.log(LocalStorage.id)
        this.$store.dispatch('tabs/loadAndWatch')
      }
    },
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
    if (this.logged) {
      this.$store.dispatch('tabs/loadAndWatch')
    }
    let that = this
    this.$axios.get('parse-sandbox/login?password=d6b9fa2c-2c9a-4a05-8a4a-ffe54e373dbc&username=70sfwc-maVoix&=', {
      headers: {
        'x-parse-application-id': 'connect-sandbox',
        'x-parse-revocable-session': '1'
      }
    }).then(function (response) {
      console.log(response)
      LocalStorage.session = response.data.sessionToken
      let headers = {
        'content-type': 'application/json',
        'x-parse-application-id': 'connect-sandbox',
        'x-parse-session-token': LocalStorage.session
      }
      console.log('username:')
      console.log(LocalStorage.id)
      let data = {
        'score': 0,
        'playerName': LocalStorage.id,
        'cheatMode': false
      }
      that.$axios.post('parse-sandbox/classes/GameScore', data, {
        headers: headers
      }).then(function (response) {
        console.log('resp:')
        console.log(response)
      })
    })
    this.$store.dispatch('tts/init')
  }
}
</script>
