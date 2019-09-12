<template>
  <q-page class="flex column flex-center">
    <q-btn color="teal" class="q-my-sm q-px-xl">
      <q-icon left size="3em" name="camera" />
      <div>QRCode</div>
    </q-btn>

    <q-btn color="teal" class="q-my-sm q-px-xl" :to="{ name: 'auth-manual' }">
      <q-icon left size="3em" name="keyboard" />
      <div>Manuel</div>
    </q-btn>
  </q-page>
</template>

<script>
export default {
  name: 'PageAuthHome'
}
</script>
