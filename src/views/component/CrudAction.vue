<template>
  <div>
    <b-spinner v-if="loading" variant="primary" label="Text Centered" />
    <feather-icon v-else :icon="icon" size="18" class="cursor-pointer mx-50" />
    <crud-popup :modal-popup="modalPopup" :item="item" :on-action="onAction" />
  </div>
</template>
<script lang="ts">
import { computed } from '@vue/composition-api'
import { BSpinner } from 'bootstrap-vue'
import CrudPopup from './CrudPopup.vue'

export default {
  components: { CrudPopup, BSpinner },
  props: {
    action: {
      type: String,
      default: 'create',
    },
    popup: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: 'PlusIcon',
    },
    item: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const modalPopup = computed(() => ({
      actions: props.action,
      popup: props.popup,
    }))
    return {
      modalPopup,
    }
  },
  methods: {
    onAction(event) {
      this.$emit('on-action', event)
      console.log(event)
    },
  },
}
</script>
