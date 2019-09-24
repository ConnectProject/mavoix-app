<template>
  <q-page class="flex flex-center justify-around">
    <q-form
      @submit="onSubmit"
      class="column flex-center"
    >
      <q-input
        :value="invitationCode"
        @input="setInvitationCode"
        outlined
        label="Code d'invitation"
      />

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
  computed: {
    invitationCode () {
      return this.$store.getters['auth/invitationCode']
    }
  },
  methods: {
    setInvitationCode (value) {
      this.$store.commit('auth/setInvitationCode', value)
    },
    onSubmit () {
      this.$store.dispatch('auth/login')
    }
  }
}
</script>
