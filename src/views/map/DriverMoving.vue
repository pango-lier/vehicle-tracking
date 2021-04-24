<template>
  <div>
    <l-moving-marker
      v-for="drive in drivers"
      :key="drive.uuid"
      :lat-lng="drive.latLng"
      :duration="2000"
      :keep-at-center="false"
      :icon="drive.icon"
    ></l-moving-marker>
  </div>
</template>
<script>
import { ref } from '@vue/composition-api'
import L from 'leaflet'
import LMovingMarker from 'vue2-leaflet-movingmarker'

export default {
  components: {
    LMovingMarker,
  },
  setup() {
    const drivers = ref([])
    function rand(n) {
      const max = n + 0.01
      const min = n - 0.01
      return Math.random() * (max - min) + min
    }
    function fetchDriver(key) {
      const driver = {
        icon: L.icon({
          iconUrl: 'favicon.ico',
          iconSize: [10, 15],
          iconAnchor: [10.5, 31],
          popupAnchor: [4, -25],
        }),
        latLng: L.latLng(rand(48.8929425), rand(2.3821873)),
        uuid: key,
      }
      drivers.value.push(driver)
    }
    for (let i = 0; i < 5; i += 1) {
      fetchDriver(i)
    }
    return {
      drivers,
    }
  },
}
</script>
