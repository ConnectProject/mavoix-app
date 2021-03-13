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
    console.log(localStorage.active)
    if (localStorage.id) {
      let tabs = JSON.parse(localStorage.tabs)
      let active = parseInt(localStorage.active.substring(2))
      this.$router.push(
        { path: '/tabs/' + tabs[active].slug }
      )
    }
  }
}
</script>
