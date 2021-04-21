<template>
  <div>
    <modal-popup
      :modal-popup="modalPopup"
      :font-data="fontData"
      @on-close-modal="onCloseModal"
    ></modal-popup>
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
              <b-input-group class="input-group-merge mr-1">
                <b-input-group-prepend is-text>
                  <feather-icon icon="SearchIcon" />
                </b-input-group-prepend>
                <b-form-input v-model.trim="searchQuery" placeholder="Search" />
                <b-input-group-append is-text>
                  <b-spinner
                    v-show="searchLoading"
                    style="width: 16px; height: 16px"
                    variant="primary"
                  />
                </b-input-group-append>
              </b-input-group>
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="primary "
                class="d-flex"
                @click="onNew()"
              >
                <feather-icon icon="PlusIcon" class="mr-50" />
                <span class="text-nowrap align-middle">New Fonts</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        id="font_table"
        responsive="sm"
        :items="fontList"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        primary-key="id"
      >
        <template #cell(image)="row">
          <img
            :id="`thumbnail-${row.item.id}`"
            :src="row.item.image"
            alt="thumbnail"
            class="rounded image-thumbnail"
          />
        </template>
        <template #cell(actions)="row">
          <feather-icon
            icon="EditIcon"
            size="18"
            class="cursor-pointer mx-50"
            @click="onEdit(row)"
          />
          <feather-icon
            icon="Trash2Icon"
            size="18"
            class="cursor-pointer mx-50"
            @click="onDelete(row)"
          />
        </template>
      </b-table>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        first-text="First"
        prev-text="Prev"
        next-text="Next"
        last-text="Last"
        align="right"
        class="mr-3"
      ></b-pagination>
      <p :style="{}"></p>
    </b-card>
  </div>
</template>
<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BInputGroupPrepend,
  BInputGroupAppend,
  BButton,
  BTable,
  BSpinner,
  BPagination,
  BInputGroup,
} from 'bootstrap-vue'

import vSelect from 'vue-select'
import store from '@/store'
import fontStoreModule from '@/store/fontStore'
import Ripple from 'vue-ripple-directive'
import {
  watch,
  computed,
  onMounted,
  onUnmounted,
  ref,
} from '@vue/composition-api'
import ModalPopup from './ModalPopup.vue'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BInputGroup,
    BInputGroupPrepend,
    BInputGroupAppend,
    BButton,
    BTable,
    BSpinner,
    vSelect,
    BPagination,
    ModalPopup,
  },
  directives: {
    Ripple,
  },
  setup() {
    const FONT_STORE_MODULE_NAME = 'font'

    // Register module
    if (!store.hasModule(FONT_STORE_MODULE_NAME))
      store.registerModule(FONT_STORE_MODULE_NAME, fontStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(FONT_STORE_MODULE_NAME))
        store.unregisterModule(FONT_STORE_MODULE_NAME)
    })

    const fields = [
      {
        key: 'id',
        label: 'Id',
        sortable: true,
      },
      {
        key: 'fontName',
        label: 'Name',
        sortable: true,
      },
      {
        key: 'image',
        label: 'Font',
        sortable: true,
        tdClass: 'font-text',
        id: 'tera',
      },
      {
        key: 'actions',
        label: 'Actions',
        thStyle: { width: '200px' },
      },
    ]
    const sortBy = ref('id')
    const sortDesc = ref(true)
    const perPage = ref(10)
    const currentPage = ref(1)
    const perPageOptions = [10, 25, 50, 100]
    const searchQuery = ref('')
    const searchTimout = ref(null)
    const searchLoading = ref(false)
    const totalRows = computed(() => store.state.font.totalRows)
    const fontList = computed(() => store.state.font.list)
    const modalPopup = ref({
      popup: false,
      actions: 'create',
    })
    const fontData = ref({
      id: null,
      fontName: null,
      image: null,
      file: null,
    })

    const onNew = () => {
      modalPopup.value.popup = true
      modalPopup.value.actions = 'create'
      fontData.value.id = null
      fontData.value.fontName = ''
      fontData.value.file = null
    }
    const onEdit = data => {
      fontData.value.id = data.item.id
      fontData.value.fontName = data.item.fontName
      fontData.value.image = data.item.image
      fontData.value.file = data.item.file
      modalPopup.value.popup = true
      modalPopup.value.actions = 'edit'
    }
    const onDelete = data => {
      fontData.value.id = data.item.id
      fontData.value.fontName = data.item.fontName
      fontData.value.image = data.item.image
      fontData.value.file = data.item.file
      modalPopup.value.popup = true
      modalPopup.value.actions = 'delete'
    }
    const fetchFont = (search = false) => {
      if (search === true) searchLoading.value = true
      const params = new URLSearchParams()
      params.append('skip', (currentPage.value - 1) * perPage.value)
      if (searchQuery.value !== null && searchQuery.value !== '') {
        if (Number.isInteger(parseInt(searchQuery.value, 10))) {
          params.append('filter', `{ "id": "${searchQuery.value}" }`)
        } else
          params.append(
            'filter',
            `{ "fontName__ilike": "%${searchQuery.value}%" }`
          )
      }
      params.append('order_by', '-id')
      params.append('limit', perPage.value)
      store.dispatch('font/fetch', params).finally(() => {
        searchLoading.value = false
      })
    }
    // Upload font

    onMounted(() => {
      fetchFont()
    })
    watch(searchQuery, () => {
      if (searchTimout.value) {
        clearTimeout(searchTimout.value)
        searchTimout.value = null
      }
      searchTimout.value = setTimeout(() => {
        fetchFont(true)
      }, 500)
    })
    watch(perPage, () => {
      currentPage.value = 1
      fetchFont()
    })
    watch(currentPage, () => {
      fetchFont()
    })
    return {
      fields,
      fontList,
      totalRows,
      perPage,
      currentPage,
      perPageOptions,
      searchQuery,
      searchLoading,
      sortBy,
      sortDesc,

      fontData,
      modalPopup,

      onNew,
      onEdit,
      onDelete,
    }
  },

  methods: {
    onCloseModal() {
      const aModalPopup = this.modalPopup
      aModalPopup.popup = false
      this.modalPopup = aModalPopup
    },
    onUpdateListFont() {
      this.onCloseModal()
    },
  },
}
</script>

<style lang="scss">
/* cyrillic-ext */
// @font-face {
//   font-family: 'Rob';
//   src: url('https://fonts.gstatic.com/s/arvo/v9/rC7kKhY-eUDY-ucISTIf5PesZW2xOQ-xsNqO47m55DA.woff2')
//     format('woff2');
// }
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
