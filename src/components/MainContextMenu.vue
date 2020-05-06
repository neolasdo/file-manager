<template>
  <div>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense tile>
        <v-list-item @click="openFormModal">
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>New folder</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openUploadModal">
          <v-list-item-icon>
            <v-icon>mdi-file-upload</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Upload</v-list-item-title>
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
    },
    data() {
      return {
        showMenu: false,
        x: 0,
        y: 0,
      }
    },
    methods: {
      createFolder(payload) {
        this.$fileStore.dispatch('createFolder', payload)
      },
      editFolder(payload) {
        this.$fileStore.dispatch('editFolder', payload)
      },
      editFile(payload) {
        this.$fileStore.dispatch('editFile', payload)
      },
      resetSelectedFiles() {
        this.$fileStore.dispatch('resetSelectedFiles')
      },
      openUploadModal() {
        this.$fileStore.dispatch('openUploadModal')
      },
      openFormModal(payload) {
        this.$fileStore.dispatch('openFormModal', payload)
      },
      showContextMenu(e) {
        this.showMenu = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.resetSelectedFiles()
        this.$nextTick(() => {
          this.showMenu = true;
        });
      },
      hideContextMenu() {
        this.showMenu = false;
      }
    }
  }
</script>
