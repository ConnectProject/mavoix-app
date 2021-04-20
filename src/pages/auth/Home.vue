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
export default {
  name: 'PageAuthHome',
  mounted () {
    if (localStorage.id) {
      console.log('before')
      this.$router.push({ name: 'dropZone' })
      console.log('after')
    }
  }
}
</script>
