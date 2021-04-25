<template>
  <div>
    <div v-if="error">{{ error.message }}</div>
    <form @submit.prevent="pressed()">
      <div class="email">
        <input v-model="email" type="email" placeholder="email" />
      </div>
      <div class="email">
        <input v-model="password" type="password" placeholder="password" />
      </div>
      <button type="submit">Login</button>
    </form>
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
    async pressed() {
      try {
        const user = await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
        console.log(user)
        this.$router.replace({ name: 'secret' })
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
