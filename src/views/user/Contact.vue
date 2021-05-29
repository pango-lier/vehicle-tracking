<template>
  <b-form @submit.prevent>
    <b-row>
      <!-- first name -->
      <b-col class="text-center">
        <h1>Contact me</h1>
        <p>+84358716640</p>
        <p>kinhdoanh11@gmail.com</p>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { BRow, BCol, BForm } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import store from '@/store'

export default {
  components: {
    BRow,
    BCol,
    BForm,
  },
  directives: {
    Ripple,
  },
  mounted() {
    store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', false)
  },
  destroyed() {
    store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', true)
  },
}
</script>
