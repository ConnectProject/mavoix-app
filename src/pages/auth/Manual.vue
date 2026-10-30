<template>
  <q-page class="flex flex-center justify-around">
    <q-form
      @submit="onSubmit"
      class="column flex-center"
    >
      <!-- Connection code copied from the panel ("Lier un appareil") -->
      <q-input
        v-model="code"
        outlined
        autofocus
        autocomplete="off"
        label="Code de connexion"
        hint="Collez le code affiché dans le panneau (Lier un appareil)"
        style="min-width: 320px"
      />
      <br />
      <!-- Submit -->
      <q-btn
        flat
        label="Se connecter"
        type="submit"
        color="primary"
      />
    </q-form>
  </q-page>
</template>

<script>
export default {
  name: 'PageAuthManual',
  data () {
    return {
      code: ''
    }
  },
  computed: {
    error () {
      return this.$store.getters['auth/error']
    }
  },
  methods: {
    onSubmit () {
      const code = this.code.trim()
      // the code has the form username:password, see auth/loginCode
      if (!code.includes(':')) {
        this.$q.notify({ position: 'top-right', message: 'Code invalide : copiez-le en entier depuis le panneau.', color: 'red' })
        return
      }
      this.$store.dispatch('auth/loginCode', code)
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
