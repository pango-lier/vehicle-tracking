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
      title="Select Icon"
      hide-footer
      @close="onClose"
    >
      <div class="d-flex justify-content-start icon-picker flex-wrap">
        <div
          v-for="(icon, i) in icons"
          :key="`icons-maker-${i}`"
          :class="{
            'icon-picker-item': true,
            'icon-picker-active': activeIcon === i,
          }"
          @click="onClickIcon(i, icon)"
        >
          <img :src="icon" alt="Icon marker" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BModal, VBModal } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { ref, onMounted, computed } from '@vue/composition-api'
import store from '@/store'

export default {
  components: {
    BModal,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    modal: {
      type: Object,
      default: null,
    },
  },
  setup(props, context) {
    onMounted(() => {
      store.dispatch('icon/fetch')
    })
    const icons = computed(() => {
      if (props.modal.acctions === 'icon-start') {
        return store.state.icon.list.start32x32
      }
      return store.state.icon.list.end32x32
    })
    const activeIcon = ref(null)
    const onClose = () => {
      context.emit('on-close')
    }
    const onClickIcon = (i, icon) => {
      activeIcon.value = i
      context.emit('on-select-icon', {
        acctions: props.modal.acctions,
        icon,
      })
    }
    return {
      activeIcon,
      onClickIcon,
      onClose,
      icons,
    }
  },
}
</script>
<style>
.icon-picker-item {
  width: 38px;
  height: 38px;
  padding: 2px;
  margin: 4px;
  border: 1px solid rgb(238, 241, 234);
  border-radius: 2px;
  cursor: pointer;
}
.icon-picker-item:hover {
  border: 1px solid rgb(51, 191, 226);
}
.icon-picker-active {
  border: 1px solid rgb(8, 236, 111);
}
</style>
