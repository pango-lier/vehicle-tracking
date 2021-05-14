<template>
  <div>
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="url" />
      <div v-for="(point, i) in points" :key="point.id">
        <l-marker
          :lat-lng="point.markerEnd"
          :icon="iconEnd(i)"
          @click="onDriver(point)"
        />
        <l-polyline :lat-lngs="point.latlngs" :color="drivers[i].line.color" />
        <l-marker
          :lat-lng="point.markerStart"
          :icon="iconStart(i)"
          @click="onDriver(point)"
        />
        <l-circle-marker
          v-if="driver.id === point.id"
          :lat-lng="driver.markerStart"
          :radius="circle.radius"
          :color="circle.color"
        />
      </div>
    </l-map>
  </div>
</template>

<script>
/* eslint-disable global-require */
import {
  LMap,
  LTileLayer,
  LMarker,
  LPolyline,
  LCircleMarker,
} from 'vue2-leaflet'
import L from 'leaflet'
import store from '@/store'
import { computed, onMounted, ref } from '@vue/composition-api'

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
    LCircleMarker,
  },
  setup() {
    onMounted(() => {
      store.dispatch('driver/fetch')
    })
    const driver = ref({
      id: null,
      markerEnd: {},
      markerStart: {},
    })
    const url = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    const zoom = ref(10)
    const center = ref([6.992305, 6.191017412])
    const circle = ref({
      center: [47.41322, -1.0482],
      radius: 6,
      color: 'red',
    })
    const drivers = computed(() => store.state.driver.list)
    const points = computed(() => store.state.driver.points)
    const onDriver = data => {
      driver.value.id = data.id
      driver.value.markerEnd = data.markerEnd
      driver.value.markerStart = data.markerStart
    }
    const iconStart = i => {
      const icon = L.icon({
        iconUrl: drivers.value[i].markerIconStart,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, 0],
      })
      return icon
    }
    const iconEnd = i => {
      const icon = L.icon({
        iconUrl: drivers.value[i].markerIconEnd,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, 0],
      })
      return icon
    }

    return {
      url,
      zoom,
      center,
      drivers,
      points,
      iconStart,
      iconEnd,
      circle,
      driver,
      onDriver,
    }
  },

  methods: {
    updateCenterMap(center) {
      console.log(center)
      this.center = center
    },
    getIcon() {
      return L.divIcon({
        className: 'my-custom-pin',
        html: `<img src="data:image/png;base64,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"/>`,
      })
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
