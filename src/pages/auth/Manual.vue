<template>
  <q-page class="flex flex-center justify-around">
    <q-form
      @submit="onSubmit"
      class="column flex-center"
    >
      <!-- Invitation code input -->
      <q-input
        v-model="username"
        outlined
        label="nom d'utilisateur"
      />
      <br />
      <q-input
        v-model="password"
        outlined
        type="password"
        label="mot de passe"
      />
      <br />
      <!-- Submit -->
      <q-btn
        flat
        label="Submit"
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
      username: '',
      password: ''
    }
  },
  computed: {
    error () {
      return this.$store.getters['auth/error']
    }
  },
  methods: {
    onSubmit () {
      this.$store.dispatch('auth/login', [this.username, this.password])
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
