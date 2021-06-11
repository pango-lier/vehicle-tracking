<template>
  <p class="clearfix mb-0">
    <span class="float-md-left d-block d-md-inline-block mt-25">
      COPYRIGHT © {{ new Date().getFullYear() }}
      <b-link
        class="ml-25"
        href="https://1.envato.market/pixinvent_portfolio"
        target="_blank"
        >Verhicle Tracking</b-link
      >
      <span class="d-none d-sm-inline-block">, All rights Reserved</span>
    </span>

    <span  class="float-md-right d-none d-md-block">
      <feather-icon
        icon="MailIcon"
        size="21"
        class="text-danger stroke-current"
      />
      kinhdoanh11.bt@gmail.com
    </span>
    <span class="text-primary float-md-right  d-none d-md-block mr-2">
      <feather-icon
        icon="MessageCircleIcon"
        size="21"
        class="text-primary stroke-current"
      />Telegram
    </span>
  </p>
</template>

<script>
import { BLink } from 'bootstrap-vue'

export default {
  components: {
    BLink,
  },
}
</script>
