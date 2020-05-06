<template>
  <div>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense tile>
        <v-list-item @click="preview" v-if="canPreview()">
          <v-list-item-icon>
            <v-icon>mdi-eye</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Preview</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="selectedItems.length === 1" @click="openFormModal()">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Rename</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="download">
          <v-list-item-icon>
            <v-icon>mdi-download</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Download</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="deleteAll()">
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <file-preview-modal ref="filePreviewModal"/>
  </div>
</template>

<script>
  import {canPreview} from "../helpers/file";
  import FilePreviewModal from './FilePreviewModal'

  export default {
    name: 'FileContextMenu',
    components: {
      'file-preview-modal': FilePreviewModal
    },
    data() {
      return {
        showMenu: false,
        x: 0,
        y: 0,
      }
    },
    computed: {
      selectedItems() {
        return this.$fileStore.state.selectedFiles
      },
    },
    methods: {
      deleteSelected(payload) {
        this.$fileStore.dispatch('deleteSelected', payload)
      },
      openFormModal(payload) {
        this.$fileStore.dispatch('openFormModal', payload)
      },
      showContextMenu(e) {
        this.showMenu = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.$nextTick(() => {
          this.showMenu = true;
        });
      },
      download() {
        let endpoint = this.$store.$endpoints.download

        this.$store.$axios({
          method: endpoint.method,
          url: endpoint.url,
          data: this.selectedItems
        }).then(res => {
          console.log(res)
        }).catch(error => {
          console.log(error)
        })
      },
      hideContextMenu() {
        this.showMenu = false;
      },
      canPreview() {
        return this.selectedItems.length === 1 && canPreview(this.selectedItems[0].path)
      },
      deleteAll() {
        this.deleteSelected()
      },
      preview() {
        if (this.selectedItems.length === 1) {
          this.$refs.filePreviewModal.showPreview(this.selectedItems[0])
        }
      }
    }
  }
</script>
