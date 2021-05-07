<template>
  <div>
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="url" />
      <div v-for="driver in drivers" :key="driver.uid">
        <l-marker
          :lat-lng="driver.markerLatLng"
          @click="updateCenterMap(driver.markerLatLng)"
        />
        <l-polyline :lat-lngs="driver.latlngs" :color="driver.color" />
        <driver-moving :latlng="driver.markerLatLng" />
      </div>
    </l-map>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { LMap, LTileLayer, LMarker, LPolyline } from 'vue2-leaflet'
import L from 'leaflet'
import store from '@/store'
import DriverMoving from './map/DriverMoving.vue'
// eslint-disable-next-line no-underscore-dangle
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})
/* eslint-disable global-require */
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    DriverMoving,
  },
  data() {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 10,
      center: [6.992305, 6.191017412],
      drivers: store.state.users.drivers,
    }
  },
  mounted() {
    store.dispatch('users/getDriver')
  },
  methods: {
    updateCenterMap(center) {
      console.log(center)
      this.center = center
    },
  },
}
</script>

<style lang="scss">
.vue2leaflet-map {
  &.leaflet-container {
    height: 800px;
  }
}
</style>
