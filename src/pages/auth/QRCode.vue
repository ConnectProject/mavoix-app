<template>
  <q-page class="flex flex-center justify-around" style="background:transparent; opacity:0">
  </q-page>
</template>

<script>

export default {
  name: 'PageAuthManual',
  computed: {
  },
  data () {
    return {
    }
  },
  mounted () {
    window.QRScanner.prepare(this.showScan)
  },
  beforeDestroy () {
  },
  methods: {
    setInvitationCode (value) {
      this.$store.commit('auth/setInvitationCode', value)
    },
    displayContents (err, text) {
      if (err) {
        // an error occurred, or the scan was canceled (error code `6`)
      } else {
        // The scan completed, display the contents of the QR code:
        this.setInvitationCode(text)
        this.$store.dispatch('auth/loginCode')
      }
    },
    showScan (err, status) {
      if (err) {
        console.error(err._message)
      } else {
        window.QRScanner.scan(this.displayContents)
        window.QRScanner.show()
      }
    }
  }
}
</script>
