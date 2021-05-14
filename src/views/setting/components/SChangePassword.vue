<template>
  <div>
    <b-form>
      <b-col cols="12">
        <b-form-group label="Your password" label-for="vi-about">
          <b-input-group class="input-group-merge">
            <b-input-group-prepend is-text>
              <feather-icon icon="LockIcon" />
            </b-input-group-prepend>
            <b-form-input
              id="vi-about"
              v-model="password.old"
              type="text"
              placeholder="Your password"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
      <!-- password -->
      <b-col cols="12">
        <b-form-group label="New password" label-for="vi-about">
          <b-input-group class="input-group-merge">
            <b-input-group-prepend is-text>
              <feather-icon icon="LockIcon" />
            </b-input-group-prepend>
            <b-form-input
              id="vi-about"
              v-model="password.new"
              type="text"
              placeholder="New password"
            />
          </b-input-group>
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
  },
  directives: {
    Ripple,
  },
  props: {
    password: {
      type: Object,
      default: null,
    },
  },
  setup(props, context) {
    const onSave = () => {
      context.emit('on-save', props.password)
    }
    return {
      onSave,
    }
  },
}
</script>
