<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-tabs v-model="active" :style="`background-color: ${activeColor}; height: 4.5em`" align="center">
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
      activeColor: 'white'
    }
  },
  computed: {
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
    setActiveColor () {
      let tab = this.tabs.find((value) => {
        return value.slug === this.$route.params.slug
      })
      this.activeColor = tab.hexColor
    }
  },
  watch: {
    $route () {
      this.setActiveColor()
    },
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
