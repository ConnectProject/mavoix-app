<template>
  <q-page class="flex column flex-center">
    <!-- QRCode authentication button -->
    <q-btn
      class="q-my-sm q-px-xl"
      color="teal"
      :to="{ name: 'auth-qrcode' }"
    >
      <q-icon
        left
        size="3em"
        name="camera"
      />
      <div>QRCode</div>
    </q-btn>

    <!-- Manual authentication button -->
    <q-btn
      class="q-my-sm q-px-xl"
      color="teal"
      :to="{ name: 'auth-manual' }"
    >
      <q-icon
        left
        size="3em"
        name="keyboard"
      />
      <div>Manuel</div>
    </q-btn>
  </q-page>
</template>

<script>
import Parse from 'parse'

export default {
  name: 'PageAuthHome',
  mounted () {
    var currentUser = Parse.User.current()
    if (currentUser) {
      // await this.$store.dispatch('tabs/loadAndWatch')
      this.$router.push({ name: 'dropZone' })
    }
  }
}
</script>
