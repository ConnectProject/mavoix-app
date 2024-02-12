<template>
  <q-page
    class="flex flex-center justify-around"
  >
  <video id="qr-video"></video>
  </q-page>
</template>

<script>
import { Platform } from 'quasar'
import QrScanner from 'qr-scanner'

let qrScanner
let isLoggingIn
isLoggingIn = false

export default {
  name: 'PageAuthManual',
  computed: {
    error () {
      return this.$store.getters['auth/error']
    }
  },
  data () {
    return {
    }
  },
  async mounted () {
    if (Platform.is.capacitor) {
      // npm qr-scanner is not working with capacitor, we need to use the cordova plugin
      window.QRScanner.prepare(this.showScan)
    } else {
      const videoElem = document.getElementById('qr-video')
      qrScanner = new QrScanner(
        videoElem,
        this.tryLogin,
        {
          highlightScanRegion: true,
          returnDetailedScanResult: false,
          onDecodeError: () => {}
        }
      )
      try {
        await qrScanner.start()
      } catch (err) {
        alert(err)
      }
    }
  },
  beforeDestroy () {
    qrScanner?.stop()
    window.QRScanner?.cancelScan()
  },
  methods: {
    displayContents (err, text) {
      if (err) {
        // an error occurred, or the scan was canceled (error code `6`)
      } else {
        // The scan completed, display the contents of the QR code:
        this.$store.dispatch('auth/loginCode', text)
      }
    },
    showScan (err, status) {
      if (err) {
        console.error(err._message)
      } else {
        window.QRScanner.scan(this.displayContents)
        window.QRScanner.show()
      }
    },
    async tryLogin (result) {
      console.log('isLoggingIn:', isLoggingIn)
      if (isLoggingIn) {
        // do not try to connect twice at the same time
        return
      }
      isLoggingIn = true
      const userId = await this.$store.dispatch('auth/loginCode', result.data)
      if (!userId) {
        isLoggingIn = false
      }
    }
  },
  watch: {
    error (newVal) {
      if (newVal) {
        this.$q.notify({ position: 'top-right', message: newVal, color: 'red' })
        this.$store.commit('auth/resetError')
      }
    }
  }
}
</script>
