<template>
  <div>Logout</div>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'Logout',
  created() {
    this.logout()
  },
  methods: {
    async logout() {
      try {
        await firebase.auth().signOut()
        this.$router.replace({ name: 'login' })
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
