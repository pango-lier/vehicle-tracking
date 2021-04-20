<template>
  <div>
    <b-card no-body class="mb-0">
      <div class="m-2">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Show</label>
            <v-select
              v-model="perPage"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block mx-50"
            />
            <label>entries</label>
          </b-col>

          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Search..."
              />
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="primary "
                class="d-flex"
                @click="onAddNewTemplate()"
              >
                <feather-icon icon="PlusIcon" class="mr-50" />
                <span class="text-nowrap align-middle">New Template</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table responsive="sm" :items="templateList" :fields="fields">
        <template #cell(img)="row">
          <img
            :id="`thumbnail-${row.item.id}`"
            :src="row.item.image_root"
            alt="thumbnail"
            class="rounded image-thumbnail"
          />

          <b-popover
            :target="`thumbnail-${row.item.id}`"
            variant="secondary"
            triggers="hover"
            placement="top"
          >
            <img
              :id="`thumbnail-${row.item.id}`"
              :src="row.item.image_root"
              alt="thumbnail"
              class="rounded image-preview"
            />
          </b-popover>
        </template>
        <template #cell(actions)="row">
          <feather-icon
            icon="EditIcon"
            size="18"
            class="cursor-pointer mx-50"
            @click="onEditTemplate(row)"
          />
          <feather-icon
            icon="Trash2Icon"
            size="18"
            class="cursor-pointer mx-50"
            @click="deleteTemplate(row)"
          />
        </template>
      </b-table>

      <b-modal
        id="add-new-template"
        ref="create-template"
        v-model="showEditTemplate"
        content-class="shadow"
        title="Upload template"
        centered
        no-fade
        no-close-on-backdrop
        no-close-on-esc
        hide-footer
        @close="onCloseEditing()"
      >
        <b-form>
          <b-form-group label="Template Name" label-for="template-name">
            <b-form-input
              id="template-name"
              v-model="templateName"
              placeholder="Enter name"
            />
          </b-form-group>
        </b-form>

        <div>
          <label for="template-desciption">Description</label>
          <b-form-textarea
            id="template-desciption"
            v-model="templateDescription"
            placeholder="Description"
            rows="3"
          />
        </div>
        <div>
          <label for="template-select" class="mt-1">Select psd</label>
          <b-form-file
            id="template-select"
            v-model="templateFile"
            type="file"
            accept=".psd"
          />
        </div>

        <div class="d-flex justify-content-center mt-1">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="outline-primary"
            @click="isCreateTemplate ? createTemplate() : updateTemplate()"
          >
            <div v-if="showLoadingEffect" class="d-flex">
              <b-spinner small />
              Loading...
            </div>
            <div v-else class="d-flex">
              <feather-icon icon="ImageIcon" class="mr-50" />
              <span class="text-nowrap align-middle">{{
                isCreateTemplate ? 'Upload New Template' : 'Update Template'
              }}</span>
            </div>
          </b-button>
        </div>
      </b-modal>
    </b-card>
  </div>
</template>
<script>
import {
  BCard,
  BRow,
  BCol,
  BForm,
  BFormInput,
  BFormGroup,
  BButton,
  BTable,
  BModal,
  VBModal,
  BFormTextarea,
  BFormFile,
  BSpinner,
  BPopover,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import store from '@/store'
import templateStoreModule from '@/store/templateStore'
import { computed, onMounted, onUnmounted, ref } from '@vue/composition-api'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BForm,
    BFormInput,
    BFormGroup,
    BButton,
    BTable,
    BModal,
    BFormTextarea,
    BFormFile,
    BSpinner,
    BPopover,

    vSelect,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },

  setup() {
    const TEMPLATE_STORE_MODULE_NAME = 'template'

    // Register module
    if (!store.hasModule(TEMPLATE_STORE_MODULE_NAME))
      store.registerModule(TEMPLATE_STORE_MODULE_NAME, templateStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(TEMPLATE_STORE_MODULE_NAME))
        store.unregisterModule(TEMPLATE_STORE_MODULE_NAME)
    })

    const fields = [
      {
        key: 'id',
        label: 'Id',
        sortable: true,
        sortDirection: 'desc',
      },
      { key: 'img', label: 'Image', sortable: true },
      { key: 'title', label: 'Title', sortable: true },
      { key: 'description', label: 'Description', sortable: true },

      { key: 'actions', label: 'Actions' },
    ]

    const fetchTemplateList = () => {
      const params = new URLSearchParams()
      params.append('skip', 0)
      params.append('limit', 100)
      store.dispatch('template/fetch', params).then(response => {
        store.commit('template/FETCH', response.data.results)
      })
    }

    const templateList = computed(() => store.state.template.list)
    const perPage = ref(10)
    const currentPage = ref(1)
    const perPageOptions = [10, 25, 50, 100]
    const searchQuery = ref('')

    const showEditTemplate = ref(false)
    const isCreateTemplate = ref(true)
    const templateName = ref('')
    const templateDescription = ref('')
    const templateFile = ref(null)
    const templateId = ref(null)

    const onAddNewTemplate = () => {
      isCreateTemplate.value = true
      templateName.value = ''
      templateDescription.value = ''
      showEditTemplate.value = true
    }
    const onEditTemplate = data => {
      isCreateTemplate.value = false
      templateId.value = data.item.id
      templateName.value = data.item.title
      templateDescription.value = data.item.description
      showEditTemplate.value = true
    }

    // Upload template
    const showLoadingEffect = ref(false)
    const onCloseEditing = () => {
      showLoadingEffect.value = false
    }

    onMounted(() => {
      fetchTemplateList()
    })

    return {
      fields,
      templateList,
      perPage,
      currentPage,
      perPageOptions,
      searchQuery,
      fetchTemplateList,

      templateName,
      templateDescription,
      templateFile,
      templateId,
      showEditTemplate,
      isCreateTemplate,
      onAddNewTemplate,
      onEditTemplate,
      showLoadingEffect,
      onCloseEditing,
    }
  },

  methods: {
    createTemplate() {
      this.showLoadingEffect = true
      const params = new URLSearchParams()
      params.append('title', this.templateName)
      params.append('description', this.templateDescription)

      const formData = new FormData()
      formData.append('file_obj', this.templateFile)

      store
        .dispatch('template/create', { params, formData })
        .then(() => {
          this.fetchTemplateList()
          this.showLoadingEffect = false
          this.showEditTemplate = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Successful',
              icon: 'UploadIcon',
              variant: 'success',
              text: 'Template was created!',
            },
          })
        })
        .catch(() => {
          this.showLoadingEffect = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Failed',
              icon: 'UploadIcon',
              variant: 'danger',
              text: 'Failed to create template!',
            },
          })
        })
    },

    updateTemplate() {
      this.showLoadingEffect = true
      const payload = {
        id: this.templateId,
        body: {
          title: this.templateName,
          description: this.templateDescription,
        },
      }
      store
        .dispatch('template/update', payload)
        .then(() => {
          this.fetchTemplateList()
          this.showLoadingEffect = false
          this.showEditTemplate = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Successful',
              icon: 'EditIcon',
              variant: 'success',
              text: 'Template was updated!',
            },
          })
        })
        .catch(() => {
          this.showLoadingEffect = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Failed',
              icon: 'EditIcon',
              variant: 'danger',
              text: 'Failed to update template!',
            },
          })
        })
    },

    deleteTemplate(data) {
      store
        .dispatch('template/delete', data.item.id)
        .then(() => {
          this.fetchTemplateList()
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Successful',
              icon: 'Trash2Icon',
              variant: 'success',
              text: 'Template was deleted!',
            },
          })
        })
        .catch(() => {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Failed',
              icon: 'Trash2Icon',
              variant: 'danger',
              text: 'Failed to delete template!',
            },
          })
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
.image-thumbnail {
  width: 42px;
  height: 42px;
}
.image-preview {
  width: 300px;
  height: 300px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
