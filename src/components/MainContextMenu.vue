<template>
  <div>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense tile>
        <v-list-item @click="openFormModal" v-if="$permissions.create">
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans('add_folder') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openUploadModal" v-if="$permissions.upload">
          <v-list-item-icon>
            <v-icon>mdi-file-upload</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans('upload') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="showRequestModal('sign')" v-if="$permissions.requestSign">
            <v-list-item-icon>
                <v-icon>mdi-signature-freehand</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title>{{ $trans('request_sign') }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item @click="showRequestModal('approval')" v-if="$permissions.approvalRequest">
            <v-list-item-icon>
                <v-icon>mdi-file-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title>{{ $trans('approval_request') }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  export default {
    name: 'DocumentContextMenu',
    computed: {
      selectedItems() {
        return this.$fileStore.state.selectedItems
      },
      current() {
        return this.$fileStore.state.current
      },
      x() {
        return this.$fileStore.state.pointerEvent.x
      },
      y() {
        return this.$fileStore.state.pointerEvent.y
      },
      showMenu: {
        get: function () {
          return this.$fileStore.state.showMainContext
        },
        set: function (newValue) {
          if (!newValue) {
            this.$fileStore.dispatch('hideContext')
          }
        }
      }
    },
    methods: {
      createFolder(payload) {
        this.$fileStore.dispatch('createFolder', payload)
      },
      openUploadModal() {
        this.$fileStore.dispatch('openUploadModal')
      },
      openFormModal(payload) {
        this.$fileStore.dispatch('openFormModal', payload)
      },
      showRequestModal(payload) {
        this.$fileStore.dispatch('showRequestModal', payload)
      }
    }
  }
</script>
