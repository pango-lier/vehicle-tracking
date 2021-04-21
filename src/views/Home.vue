<template>
  <div style="height: 500px">
    <l-map
      style="height: 80%; width: 100%"
      :zoom="map.zoom"
      :center="map.center"
    >
      <l-tile-layer :url="map.url"></l-tile-layer>
    </l-map>
    <l-marker :lat-lng="map.markerLatLng"></l-marker>
  </div>
</template>
<script>
import { ref } from '@vue/composition-api'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

export default {
  name: 'Home',
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  setup() {
    const map = ref({
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 3,
      center: [47.41322, -1.219482],
      markerLatLng: [47.31322, -1.319482],
      bounds: null,
    })
    return { map }
  },
}
</script>
<style></style>
