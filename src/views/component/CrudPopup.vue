<template>
  <div>
    <b-modal
      id="modal-prevent-closing"
      v-model="modalPopup.popup"
      content-class="shadow"
      :title="
        modalPopup.actions === 'delete'
          ? 'Delete'
          : modalPopup.actions === 'edit'
          ? 'Update'
          : 'Create'
      "
      centered
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      @close="onClose"
    >
      <b-form>
        <b-form-group label="Name" label-for="item-name">
          <b-form-input
            id="item-name"
            v-model.trim="item.name"
            placeholder="Name"
            autocomplete="off"
          />
        </b-form-group>
        <b-form-group label="Email" label-for="item-email">
          <b-form-input
            id="item-email"
            v-model.trim="item.email"
            placeholder="Email"
            autocomplete="off"
          />
        </b-form-group>
      </b-form>
      <div class="d-flex justify-content-end mt-2 mb-1">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          :disabled="enableButton"
          @click="onAction"
        >
          <div class="d-flex">
            <feather-icon
              :icon="
                modalPopup.actions === 'edit'
                  ? 'UploadIcon'
                  : modalPopup.actions === 'delete'
                  ? 'TrashIcon'
                  : 'PlusIcon'
              "
              class="mr-50"
            />
            <span class="text-nowrap align-middle">
              {{
                modalPopup.actions === 'edit'
                  ? 'Update'
                  : modalPopup.actions === 'delete'
                  ? 'Delete'
                  : 'Create' + ' item'
              }}
            </span>
          </div>
        </b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>
import {
  BForm,
  BFormInput,
  BFormGroup,
  BButton,
  BFormTextarea,
} from 'bootstrap-vue'

import Ripple from 'vue-ripple-directive'
import { computed, ref } from '@vue/composition-api'

export default {
  components: {
    BForm,
    BFormInput,
    BFormGroup,
    BButton,
    BFormTextarea,
  },
  directives: {
    Ripple,
  },
  props: {
    modalPopup: {
      type: Object,
      default: null,
    },
    item: {
      type: Object,
      default: null,
    },
  },
  setup(props, context) {
    const enableButton = computed(
      () => props.item.name === '' || props.item.name === null
    )
    const onClose = () => {
      context.emit('on-close')
    }

    return {
      onClose,
      enableButton,
    }
  },
  methods: {
    onAction() {
      this.$emit('on-action', this.item)
    },
  },
}
</script>
