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
      size="lg"
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      @close="onClose"
    >
      <b-row>
        <b-col md="6">
          <b-form>
            <b-form-group label="First Name" label-for="vi-first-name">
              <b-input-group class="input-group-merge">
                <b-input-group-prepend is-text>
                  <feather-icon icon="UserIcon" />
                </b-input-group-prepend>
                <b-form-input
                  id="vi-first-name"
                  v-model="itemData.name"
                  placeholder="First Name"
                  autocomplete="off"
                />
              </b-input-group>
            </b-form-group>
            <b-form-group label="Phone" label-for="vi-mobile">
              <b-input-group class="input-group-merge">
                <b-input-group-prepend is-text>
                  <feather-icon icon="SmartphoneIcon" />
                </b-input-group-prepend>
                <b-form-input
                  id="vi-mobile"
                  v-model="itemData.phoneNumber"
                  type="text"
                  placeholder="Phone"
                />
              </b-input-group>
            </b-form-group>
            <b-form-group label="Email" label-for="vi-email">
              <b-input-group class="input-group-merge">
                <b-input-group-prepend is-text>
                  <feather-icon icon="MailIcon" />
                </b-input-group-prepend>
                <b-form-input
                  id="vi-email"
                  v-model="itemData.email"
                  type="email"
                  placeholder="Email"
                  autocomplete="off"
                />
              </b-input-group>
            </b-form-group>
            <b-form-group>
              <b-form-checkbox
                v-model="driverCustomeKey"
                inline
                class="ml-1 mr-1"
                >User a other Driver-key !</b-form-checkbox
              >
            </b-form-group>
            <b-form-group>
              <b-input-group class="input-group-merge">
                <b-input-group-prepend is-text>
                  <feather-icon icon="MailIcon" />
                </b-input-group-prepend>
                <b-form-input
                  v-model="itemData.driverKey"
                  :disabled="!driverCustomeKey"
                  type="text"
                  placeholder="Driver Access Key"
                  autocomplete="off"
                />
              </b-input-group>
            </b-form-group>
          </b-form>
        </b-col>
        <b-col md="6">
          <b-form class="ml-3">
            <b-form-group>
              <div class="d-flex justify-content-start align-items-center">
                <div>
                  <v-swatches
                    v-model="itemData.line.color"
                    popover-x="right"
                    swatches="text-advanced"
                  ></v-swatches>
                </div>
                <div class="ml-1">Line color</div>
              </div>
            </b-form-group>
            <b-form-group>
              <img
                :src="itemData.markerIconStart"
                alt="Station"
                style="cursor: pointer"
                @click.stop="pickerMarkerIconStart"
              /><span class="ml-1">Station icon</span>
            </b-form-group>
            <b-form-group>
              <img
                :src="itemData.markerIconEnd"
                alt="Station"
                style="cursor: pointer"
                @click.stop="pickerMarkerIconEnd"
              /><span class="ml-1">My icon</span>
              currrent
            </b-form-group>
            <b-form-group>
              <b-form-checkbox v-model="itemData.status" switch inline />
              Active tracking
            </b-form-group>
            <b-form-group>
              <b-form-checkbox v-model="itemData.showName" switch inline />
              Warning
            </b-form-group>
            <b-form-group>
              <b-form-checkbox v-model="itemData.warning" switch inline />
              Show name
            </b-form-group>
          </b-form>
        </b-col>
        <b-col md="12">
          <b-form-textarea
            v-model="itemData.infor"
            placeholder="Informatiion driver detail"
            rows="2"
          />
        </b-col>
      </b-row>
      <div>
        <b-alert show variant="danger">{{ errors[0] }}</b-alert>
      </div>
      <div class="d-flex justify-content-end mt-2 mb-1">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          :disabled="enableButton"
          @click="
            modalPopup.actions === 'delete'
              ? onDelete()
              : modalPopup.actions === 'edit'
              ? onUpdate()
              : onCreate()
          "
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
                  ? 'Update Driver'
                  : modalPopup.actions === 'delete'
                  ? 'Delete Driver'
                  : 'Create Driver'
              }}
            </span>
          </div>
        </b-button>
      </div>
    </b-modal>
    <icon-picker
      v-if="modalIconPicker.popup"
      :modal="modalIconPicker"
      :have-avatar="modalIconPicker.acctions == 'icon-end'"
      @on-select-icon="selecedIconPicker"
      @on-close="onCloseIconPicker"
    />
  </div>
</template>
<script>
import {
  BForm,
  BFormInput,
  BInputGroup,
  BFormGroup,
  BButton,
  BInputGroupPrepend,
  BModal,
  BRow,
  BCol,
  BAlert,
  BFormCheckbox,
  BFormTextarea,
} from 'bootstrap-vue'

import Ripple from 'vue-ripple-directive'
import { computed, ref } from '@vue/composition-api'
import VSwatches from 'vue-swatches'

// Import the styles too, typically in App.vue or main.js
import 'vue-swatches/dist/vue-swatches.css'
import store from '@/store'
import { auth } from '../../firebase'
import IconPicker from './IconPicker.vue'

export default {
  components: {
    BForm,
    BInputGroup,
    BFormInput,
    BFormGroup,
    BButton,
    BInputGroupPrepend,
    BModal,
    BRow,
    BCol,
    BAlert,
    VSwatches,
    BFormCheckbox,
    IconPicker,
    BFormTextarea,
  },
  directives: {
    Ripple,
  },
  props: {
    modalPopup: {
      type: Object,
      default() {
        return {
          popup: false,
          actions: 'create',
        }
      },
    },
    itemData: {
      type: Object,
      default: null,
    },
  },
  setup(props, context) {
    const enableButton = computed(
      () => props.itemData.name === '' || props.itemData.name === null
    )
    const driverCustomeKey = ref(false)
    const errors = ref([])
    const onClose = () => {
      driverCustomeKey.value = false
      errors.value = []
      context.emit('on-close')
    }
    const modalIconPicker = ref({
      popup: false,
      acctions: 'icon-start',
    })
    const pickerMarkerIconStart = () => {
      modalIconPicker.value.popup = true
      modalIconPicker.value.acctions = 'icon-start'
    }
    const pickerMarkerIconEnd = () => {
      modalIconPicker.value.popup = true
      modalIconPicker.value.acctions = 'icon-end'
    }
    const onCloseIconPicker = () => {
      modalIconPicker.value.popup = false
    }
    return {
      onClose,
      enableButton,
      errors,
      driverCustomeKey,

      pickerMarkerIconStart,
      pickerMarkerIconEnd,
      onCloseIconPicker,
      modalIconPicker,
    }
  },
  methods: {
    async onCreate() {
      try {
        if (!this.driverCustomeKey || this.itemData.driverKey === '') {
          const userId = auth.currentUser.uid
          const createAt = new Date().getTime()
          const secretKey =
            Math.random().toString(36).substr(2, 9) + createAt.toString(36)
          const driverRef = await store.dispatch('driver/createDriver', {
            name: this.itemData.name,
            createByUid: userId,
            secretKey,
            status: true,
          })
          this.itemData.driverKey = driverRef.id
          this.itemData.driverCustomeKey = true
        }
        await store.dispatch('driver/generateDriver', this.itemData)
        this.onClose()
      } catch (e) {
        this.errors.push(e)
      }
    },
    selecedIconPicker(e) {
      if (e.acctions === 'icon-start') {
        this.$set(this.itemData, 'markerIconStart', e.icon)
      } else {
        this.$set(this.itemData, 'markerIconEnd', e.icon)
      }
      this.onCloseIconPicker()
    },
    async onDelete() {
      try {
        await store.dispatch('driver/delete', this.itemData.id)
        this.onClose()
      } catch (e) {
        this.errors.push(e)
      }
    },
    async onUpdate() {
      try {
        console.log(this.itemData.marker.iconStart)
        await store.dispatch('driver/update', this.itemData)
        this.onClose()
      } catch (e) {
        this.errors.push(e)
      }
    },
  },
}
</script>
