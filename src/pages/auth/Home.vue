<template>
  <q-page class="flex column flex-center">
    <p>Choisissez le moyen de connexion:</p>
    <router-link :to="{ name: 'auth-manual' }">Manuel</router-link>
  </q-page>
</template>

<script>
export default {
  name: 'PageAuthHome'
}
</script>
