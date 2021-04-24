<template>
  <div>
    <button @click="logout()">LogOut</button>
  </div>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
    }
  },
  methods: {
    async logout() {
      try {
        const user = await firebase.auth().signOut()
        console.log(user)
        this.$router.replace({ name: 'login' })
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
