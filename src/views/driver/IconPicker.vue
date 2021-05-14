<template>
  <div>
    <!-- modal -->
    <b-modal
      id="modal-primary"
      v-model="modal.popup"
      ok-only
      ok-title="Accept"
      modal-class="modal-primary"
      centered
      title="Primary Modal"
    >
      <div>
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="warning"
          class="btn-icon"
        >
          <feather-icon icon="ArchiveIcon" />
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BButton, BModal, VBModal } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import {} from '@vue/composition-api'

export default {
  components: {
    BButton,
    BModal,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    icons: {
      type: Array,
      default: null,
    },
    modal: {
      type: Object,
      default: null,
    },
  },
  setup() {},
}
</script>
