<template>
  <div>
    <b-modal
      id="modal-prevent-closing"
      v-model="modalPopup.popup"
      content-class="shadow"
      :title="
        modalPopup.actions === 'edit'
          ? 'Update font'
          : modalPopup.actions === 'delete'
          ? 'Delete font ?'
          : 'Create new font'
      "
      centered
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      @close="closeModal"
    >
      <b-form>
        <b-form-group label="Name" label-for="font-name">
          <b-form-input
            id="Font-name"
            v-model.trim="fontData.fontName"
            placeholder="Enter name"
            autocomplete="off"
            :disabled="modalPopup.actions === 'delete'"
          />
        </b-form-group>
      </b-form>
      <div v-if="modalPopup.actions !== 'delete'">
        <label for="Font-select">File</label>
        <b-form-file
          id="Font-select"
          v-model="fileFonts"
          type="file"
          accept=".ttf, .otf, .eot, .woff, .woff2"
        />
      </div>
      <b-alert
        v-model="fontAlert.show"
        :variant="fontAlert.variant"
        dismissible
        class="mb-0 mt-1"
      >
        <div class="alert-body">{{ fontAlert.message }}</div>
      </b-alert>
      <div class="d-flex justify-content-end mt-2 mb-1">
        <img
          v-if="modalPopup.actions !== 'create'"
          style="height: 40px"
          :src="fontData.image"
          alt="Font"
          class="image-thumbnail mr-1"
        />
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          :disabled="enableButton"
          @click="
            modalPopup.actions === 'edit'
              ? updateFont()
              : modalPopup.actions === 'delete'
              ? deleteFont()
              : createFont()
          "
        >
          <div v-if="showLoadingEffect" class="d-flex">
            <b-spinner small />Loading . . . .
          </div>
          <div v-else class="d-flex">
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
                  ? 'Update font'
                  : modalPopup.actions === 'delete'
                  ? 'Delete font'
                  : 'Create font'
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
  BAlert,
  BFormFile,
  BSpinner,
  BModal,
} from 'bootstrap-vue'

import Ripple from 'vue-ripple-directive'
import { computed, ref, onUnmounted } from '@vue/composition-api'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from '@/store'
import fontStoreModule from '@/store/fontStore'

export default {
  components: {
    BForm,
    BFormInput,
    BFormGroup,
    BAlert,
    BButton,
    BFormFile,
    BSpinner,
    BModal,
  },
  directives: {
    Ripple,
    BModal,
  },
  props: {
    modalPopup: {
      type: Object,
      default() {
        return {
          popup: false,
          actions: '',
        }
      },
    },
    fontData: {
      type: Object,
      default() {
        return {
          id: null,
          fontName: '',
          image: null,
          file: null,
        }
      },
    },
  },
  setup(props, context) {
    const FONT_STORE_MODULE_NAME = 'font'

    // Register module
    if (!store.hasModule(FONT_STORE_MODULE_NAME))
      store.registerModule(FONT_STORE_MODULE_NAME, fontStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(FONT_STORE_MODULE_NAME))
        store.unregisterModule(FONT_STORE_MODULE_NAME)
    })
    const showLoadingEffect = ref(false)
    const fontAlert = ref({
      show: false,
      message: '',
      variant: 'primary',
    })
    const fileFonts = ref(null)
    const enableButton = computed(
      () =>
        props.fontData.fontName === '' ||
        (fileFonts.value === null && props.modalPopup.actions !== 'delete') ||
        showLoadingEffect.value === true
    )
    const closeModal = () => {
      context.emit('on-close-modal')
      fileFonts.value = null
      fontAlert.value.show = false
      showLoadingEffect.value = false
    }

    return {
      showLoadingEffect,
      closeModal,
      enableButton,
      fileFonts,
      fontAlert,
    }
  },
  methods: {
    toastify(variant, text) {
      const props = {
        icon: 'UploadIcon',
      }
      props.variant = variant
      props.title = variant === 'success' ? 'Successful' : 'Failed'
      props.text = text
      const options = {
        component: ToastificationContent,
        position: 'top-right',
      }
      options.props = props
      this.$toast(options)
    },
    showFontAlert(variant, name) {
      this.fontAlert.show = true
      this.fontAlert.variant = variant
      let message = ''
      this.showLoadingEffect = false
      switch (variant) {
        default:
        case 'primary':
          this.showLoadingEffect = true
          if (this.modalPopup.actions === 'edit') message = ' is uploading !'
          else if (this.modalPopup.actions === 'delete')
            message = ' is deleting !'
          else message = ' is creating !'
          break
        case 'success':
          if (this.modalPopup.actions === 'edit') message = ' is uploaded !'
          else if (this.modalPopup.actions === 'delete')
            message = ' is deleted !'
          else message = ' is created !'
          break
        case 'danger':
          message = ' is error !'
          break
      }
      this.fontAlert.message = `Font - ${name}${message}`
    },
    createFont() {
      this.showFontAlert('primary', this.fileFonts.name)
      // for (let i = 0; i < this.fileFonts.length; i += 1) {
      store
        .dispatch('font/create', {
          file: this.fileFonts,
          info: this.genName(this.fileFonts, true),
        })
        .then(() => {
          this.closeModal()
          this.toastify('success', 'Font to created !')
        })
        .catch(e => {
          this.toastify('danger', e)
          this.showFontAlert('danger', this.fileFonts.name)
        })

      // }
    },
    updateFont() {
      this.showFontAlert('primary', this.fileFonts.name)
      store
        .dispatch('font/update', {
          file: this.fileFonts,
          info: this.genName(this.fileFonts, true),
          id: this.fontData.id,
        })
        .then(() => {
          this.closeModal()
          this.toastify('success', 'Font to updated !')
        })
        .catch(e => {
          this.toastify('danger', e)
          this.showFontAlert('danger', this.fileFonts.name)
        })
    },
    deleteFont() {
      this.showFontAlert('primary', this.fontData.fontName)
      store
        .dispatch('font/delete', this.fontData.id)
        .then(() => {
          this.closeModal()
          this.toastify('success', 'Font to deleted !')
        })
        .catch(e => {
          this.toastify('danger', e)
          this.showFontAlert('danger', this.fontData.fontName)
        })
    },
    genName(file, newName) {
      const ext = file.name
        .replace(/^.*(\\|\/)/, '')
        .split('.')
        .pop()
      // custom name
      const slug = this.fontData.fontName
        .trim()
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
      let name = ''
      if (newName === true) {
        const exName = `${Date.now().toString(36)}${Math.random()
          .toString(36)
          .substring(4)}`
        name = `${slug}_${exName}.${ext}`
      } else {
        // update base name if is edit
        name = `${this.fontData.file.replace(/^.*\/|\.[^.]*$/g, '')}.${ext}`
      }
      return {
        name,
        slug,
        ext,
      }
    },
  },
}
</script>
