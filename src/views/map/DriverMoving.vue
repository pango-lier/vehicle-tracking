<template>
  <div>
    <l-moving-marker
      :lat-lng="latlng"
      :duration="2000"
      :keep-at-center="false"
      :icon="iconRef"
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
  props: {
    latlng: {
      type: Array,
      default() {},
    },
    icon: {
      type: String,
      default: 'favicon.ico',
    },
  },
  setup(props) {
    const iconRef = ref(
      L.icon({
        iconUrl: props.icon,
        iconSize: [10, 15],
        iconAnchor: [10.5, 31],
        popupAnchor: [4, -25],
      })
    )
    return {
      iconRef,
    }
  },
}
</script>
