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
          @click.stop="onClickIcon(i, icon)"
        >
          <img :src="icon" alt="Icon marker" />
        </div>
        <div
          v-if="avatar != '' && haveAvatar"
          class="icon-picker-item"
          @click.stop="onClickAvatar()"
        >
          <img :src="avatar" alt="Icon avatar" />
        </div>
      </div>
      <div v-if="haveAvatar" class="d-flex justify-content-end mt-2 mb-1">
        <b-button variant="primary" @click="onUpdateAvatar()">
          Select Avatar
        </b-button>
      </div>
      <div style="display: none">
        <input
          ref="fileInputAvatar"
          type="file"
          name="fileAvatar"
          style="display: none"
          @change="getFileAvatar"
        />
        <div class="mt-2">
          <canvas id="canvas" width="64" height="64"></canvas>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BModal, VBModal, BButton } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { ref, onMounted, computed, watch } from '@vue/composition-api'
import store from '@/store'

export default {
  components: {
    BModal,
    BButton,
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
    haveAvatar: {
      type: Boolean,
      default: false,
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
    const avatar = computed(() => store.state.icon.list.avatar32x32)

    const onClose = () => {
      context.emit('on-close')
    }
    const onClickAvatar = () => {
      if (avatar.value === '') return
      context.emit('on-select-icon', {
        acctions: props.modal.acctions,
        icon: avatar.value,
      })
    }
    const onClickIcon = (i, icon) => {
      activeIcon.value = i
      context.emit('on-select-icon', {
        acctions: props.modal.acctions,
        icon,
      })
    }
    const file = ref(null)
    const roundedImage = (ctx, x, y, width, height, radius) => {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      )
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
    }
    const handleFiles = () => {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        // const iw = img.width
        // const ih = img.height
        // const scale = Math.min(64 / iw, 64 / ih)
        // const iwScaled = iw * scale
        // const ihScaled = ih * scale
        canvas.width = 32
        canvas.height = 32
        roundedImage(ctx, 0, 0, 32, 32, 12)
        ctx.clip()
        ctx.drawImage(img, 0, 0, 32, 32)
        store.commit('icon/UPDATE_AVATAR', canvas.toDataURL('image/jpeg', 1))
      }
      img.src = URL.createObjectURL(file.value)
    }

    watch(file, () => {
      if (file.value != null) {
        handleFiles()
      }
    })
    return {
      activeIcon,
      onClickIcon,
      onClickAvatar,
      onClose,
      icons,
      file,
      avatar,
    }
  },
  methods: {
    onUpdateAvatar() {
      console.log(this.$refs.fileInputAvatar.click())
    },
    getFileAvatar(e) {
      for (let i = 0; i < 1; i += 1) {
        this.file = e.target.files[i]
      }
    },
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
