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
              <b-input-group class="input-group-merge mr-1">
                <b-input-group-prepend is-text>
                  <feather-icon icon="SearchIcon" />
                </b-input-group-prepend>
                <b-form-input
                  v-model.trim="searchQuery"
                  placeholder="Search"
                  disabled
                />
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
        :items="driverList"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        primary-key="id"
      >
        <template #cell(name)="row">
          <span
            :id="`thumbnail-${row.item.id}`"
            alt="thumbnail"
            :style="{ color: row.item.line.color }"
            class="rounded avatar-thumbnail"
            >{{ row.item.name }}
          </span>
        </template>
        <template #cell(station)="row">
          <img
            :id="`thumbnail-${row.item.id}`"
            :src="row.item.markerIconStart"
            alt="thumbnail"
            class="rounded avatar-thumbnail"
          />
        </template>
        <template #cell(avatar)="row">
          <img
            :id="`thumbnail-${row.item.id}`"
            :src="row.item.markerIconEnd"
            alt="thumbnail"
            class="rounded avatar-thumbnail"
          />
        </template>
        <template #cell(actions)="row">
          <feather-icon
            icon="EditIcon"
            size="18"
            class="cursor-pointer mx-50"
            @click="geopoint(row.item.driverKey)"
          />
          <feather-icon
            icon="EditIcon"
            size="18"
            class="cursor-pointer mx-50"
            @click="onEdit(row.item)"
          />
          <feather-icon
            icon="Trash2Icon"
            size="18"
            class="cursor-pointer mx-50"
            @click="onDelete(row.item)"
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
    </b-card>
    <crud-popup
      v-if="modalPopup.popup"
      :modal-popup="modalPopup"
      :item-data="driver"
      :driver-custome-key="false"
      @on-close="onClose"
    ></crud-popup>
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
import Ripple from 'vue-ripple-directive'
import { watch, computed, onMounted, ref } from '@vue/composition-api'
import { db } from '@/firebase'
import CrudPopup from './CrudPopup.vue'

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
    CrudPopup,
  },
  directives: {
    Ripple,
  },
  setup() {
    const fields = [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true,
      },
      {
        key: 'infor',
        label: 'Information',
        sortable: true,
      },
      {
        key: 'station',
        label: 'station',
        sortable: true,
      },
      {
        key: 'avatar',
        label: 'avatar',
        sortable: true,
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
    const totalRows = computed(() => store.state.driver.totalRows)
    const driverList = computed(() => store.state.driver.list)
    const modalPopup = ref({
      popup: false,
      actions: 'create',
    })
    const driver = ref({})
    const driverDefault = () => {
      driver.value = {
        driverKey: '',
        driverCustomeKey: false,
        name: '',
        email: '',
        phoneNumber: '',
        infor: '',
        status: true,
        showName: false,
        warning: false,
        marker: {
          type: 'default',
          icon: 'default',
          color: '#2ECC70',
          visible: true,
          opacity: 1.0,
        },
        line: {
          color: '#2ECC70',
          weight: 2,
          opacity: 1.0,
          smoothFactor: 1.0,
          className: null,
          visible: true,
        },
        fado: 'sss',
        markerIconStart: '',
        markerIconEnd: '',
      }
    }
    const onNew = () => {
      driverDefault()
      modalPopup.value.popup = true
      modalPopup.value.actions = 'create'
    }
    const onEdit = data => {
      Object.assign(driver.value, data)
      modalPopup.value.popup = true
      modalPopup.value.actions = 'edit'
    }
    const onDelete = data => {
      Object.assign(driver.value, data)
      modalPopup.value.popup = true
      modalPopup.value.actions = 'delete'
    }
    const onClose = () => {
      modalPopup.value.popup = false
    }

    const fetchDriver = (search = false) => {
      if (search === true) searchLoading.value = true
      const params = new URLSearchParams()
      params.append('skip', (currentPage.value - 1) * perPage.value)
      if (searchQuery.value !== null && searchQuery.value !== '') {
        if (Number.isInteger(parseInt(searchQuery.value, 10))) {
          params.append('filter', `{ "id": "${searchQuery.value}" }`)
        } else
          params.append('filter', `{ "name__ilike": "%${searchQuery.value}%" }`)
      }
      params.append('order_by', '-id')
      params.append('limit', perPage.value)
      store.dispatch('driver/fetch', params).finally(() => {
        searchLoading.value = false
      })
    }
    // Upload driver

    onMounted(() => {
      fetchDriver()
    })
    watch(searchQuery, () => {
      if (searchTimout.value) {
        clearTimeout(searchTimout.value)
        searchTimout.value = null
      }
      searchTimout.value = setTimeout(() => {
        fetchDriver(true)
      }, 500)
    })
    watch(perPage, () => {
      currentPage.value = 1
      fetchDriver()
    })
    watch(currentPage, () => {
      fetchDriver()
    })
    return {
      fields,
      driverList,
      totalRows,
      perPage,
      currentPage,
      perPageOptions,
      searchQuery,
      searchLoading,
      sortBy,
      sortDesc,

      driver,
      modalPopup,

      onNew,
      onEdit,
      onDelete,
      onClose,
    }
  },

  methods: {
    geopoint(driverId) {
      const lat = Math.random() * 10
      const lng = Math.random() * 10
      db.ref(`geopoints/${driverId}`)
        .push()
        .set({
          latlngs: [
            {
              lat,
              lng,
              createdAt: new Date().getTime(),
            },
          ],
          createdAt: new Date().getTime(),
        })
    },
  },
}
</script>

<style lang="scss"></style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
