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
        key: 'id',
        label: 'Key',
        sortable: true,
      },
      {
        key: 'name',
        label: 'Name',
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
        status: true,
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
        markerIconStart:
          'data:image/png;base64,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',
        markerIconEnd:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAADjElEQVRYhe1WT2gcZRT/fbO7ySRZycb6J9ZcrEqISZOYWAvJRcVcFOpBRK1aK0TBmxePQg+evGgpeDCtVDwIAdGbRqVbGmU1xio1JQhNraI2RTbJmp3MOPO99/Owa0xwVmfWai8+ZviYee/9vt+89+a9D7jCYpp15JmHdkN1UhVwRKfMnncW/jMCnH9gNw3mSLiggiqBWLundfyD1CScZggo9WmVyFUbQCIfEvkudWOyGaxsM05iA1ItqFK/LVQjNoPVVAQYeFMS+YFEHiSsQsKqz+iXo81gNV2E6zN9AxCdVFpYMVM79p072yzWFZXUERg6Ue7P0HkVinEaZECCgKjiY3X02YWJaxb/NQLDM+UxAh8aY9oBgAQA/n5BRD0V597FfTs+TYqZvAgP0bHC4yJsVyVUCFWtr7VnCjoo9jgOMTFuYsP+kfKoWt6qwm2bbl3FKsSyd9fAxZGkuIn7wFjLwnC78bEsXfhabq7FHKynoZaOwdx5XN+ygird288D80lwE0fgHvd03yvXHcOT+Y9iI0AlDnaewJGdr2PC/bIvKW5iAo90zpYoFn3ZC6VaGur530LittbvS1SLh7tOlZLiJk6BiABiIRqCSnAz9pvZAMRCEQJik8KmmAWhD6UAoafhul/6Y+fNBRpVVRgAqpefgEgIVQvxKroyOzcea7OzOqvtAWjl8hOgeGtiBRI5K41sNPRXJbsBSLiaFDdxJyRhKu/13v3EqcfWT17qnYuzmej55s5je9/IF+5fOmkMEo3n1LOg4+B0t2N4MU6nGen2ju6/lAYv9XnAuyrfMLxeW2EtLV76A8mR+34FEMRo/LoulSQuwsGZ5Q7CGTWSGfnu3aLVaHulO1lHet/+6TkFTrd5zhdnDnR7/5jAXcVv3YoUnqHyAMghklmCyLit0GhjOwHXzQN42Sjgu2Jvmf7xKyP6ZhTY1y48dVNcxGp+jRTDxdXCuhbmARwGMLqVrNOS+zNQbtu3ZA15B4HDmdbs57umlzpTE8gRQwT6Y53iCMS8q8sAo9xQI2Xj35A0I8XKi1Q+T2UOrPV/KhB5PoJyBbV3tVHc0pmH09YKKmpzggSVEWleWnr0xhdgTGxf+Ns+MFgs9ziR2Q9ijNS9VHRzk0ydQH041Qkug/yMwCcM+da5x3t++Cv81I1o9P2fb7BwrraRdBlqAQBonTWqrNJkVxYfvDa2Sf0vjeQ3DjU5cNM19HgAAAAASUVORK5CYII=',
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
