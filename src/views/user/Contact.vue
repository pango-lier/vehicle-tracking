<template>
  <div>
    <b-row>
      <b-col class="text-center">
        <h1 class="text-primary">Contact me</h1>
        <p class="text-danger">kinhdoanh11.bt@gmail.com</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <ul class="list-group">
          <li
            class="list-group-item d-flex justify-content-start align-items-center"
          >
            <span class="badge badge-primary badge-pill mr-2">1</span>
            Language programing by Vuejs and Firebase .
          </li>
          <li
            class="list-group-item d-flex justify-content-start align-items-center"
          >
            <span class="badge badge-primary badge-pill mr-2">2</span>
            Compatible with your phone application or device GPS .
          </li>
          <li
            class="list-group-item d-flex justify-content-start align-items-center"
          >
            <span class="badge badge-primary badge-pill mr-2">3</span>
            Cheaper and tracking more devide .
          </li>
          <li
            class="list-group-item d-flex justify-content-start align-items-center"
          >
            <span class="badge badge-primary badge-pill mr-2">4</span>
            Security and Safe .Setup on your firebase
          </li>
          <li
            class="list-group-item d-flex justify-content-start align-items-center"
          >
            <span class="badge badge-primary badge-pill mr-2">5</span>
            Managerment more devices and custom information .
          </li>
          <li
            class="list-group-item d-flex justify-content-start align-items-center"
          >
            <span class="badge badge-primary badge-pill mr-2">6</span>
            Buy source ,custom your application and requre your feature .
          </li>
          <li
            class="list-group-item d-flex justify-content-start align-items-center"
          >
            <span class="badge badge-primary badge-pill mr-2">7</span>
            Contact kinhdoanh11.bt@gmail.com to more detail .
          </li>
        </ul>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import store from '@/store'

export default {
  components: {
    BRow,
    BCol,
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
