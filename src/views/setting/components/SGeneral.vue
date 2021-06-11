<template>
  <div>
    <b-form>
      <!-- first name -->
      <b-col cols="12">
        <b-form-group label="First Name" label-for="vi-first-name">
          <b-input-group class="input-group-merge">
            <b-input-group-prepend is-text>
              <feather-icon icon="UserIcon" />
            </b-input-group-prepend>
            <b-form-input
              id="vi-first-name"
              v-model="generals.fullName"
              placeholder="First Name"
            />
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- email -->
      <b-col cols="12">
        <b-form-group label="Email" label-for="vi-email">
          <b-input-group class="input-group-merge">
            <b-input-group-prepend is-text>
              <feather-icon icon="MailIcon" />
            </b-input-group-prepend>
            <b-form-input
              id="vi-email"
              v-model="generals.email"
              type="email"
              placeholder="Email"
            />
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- mobile -->
      <b-col cols="12">
        <b-form-group label="Mobile" label-for="vi-mobile">
          <b-input-group class="input-group-merge">
            <b-input-group-prepend is-text>
              <feather-icon icon="SmartphoneIcon" />
            </b-input-group-prepend>
            <b-form-input
              id="vi-mobile"
              v-model="generals.phone"
              type="number"
              placeholder="Mobile"
            />
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- password -->
      <b-col cols="12">
        <b-form-group label="About me" label-for="vi-about">
          <b-form-textarea
            id="vi-about"
            v-model="generals.about"
            placeholder="About me"
            rows="3"
          />
        </b-form-group>
      </b-col>
      <!-- reset and submit -->
      <b-col cols="12">
        <div class="d-flex justify-content-end">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="button"
            variant="primary"
            class="mr-1"
            @click="onSave"
            >Submit</b-button
          >
        </div>
      </b-col>
    </b-form>
  </div>
</template>
<script>
import {} from '@vue/composition-api'
import Ripple from 'vue-ripple-directive'
import {
  BFormInput,
  BInputGroup,
  BInputGroupPrepend,
  BFormGroup,
  BButton,
  BForm,
  BCol,
  BFormTextarea,
} from 'bootstrap-vue'

export default {
  components: {
    BFormInput,
    BInputGroup,
    BInputGroupPrepend,
    BFormGroup,
    BButton,
    BForm,
    BCol,
    BFormTextarea,
  },
  directives: {
    Ripple,
  },
  props: {
    generals: {
      type: Object,
      default: null,
    },
  },
  setup(props, context) {
    const onSave = () => {
      context.emit('on-save', props.generals)
    }
    return {
      onSave,
    }
  },
}
</script>
