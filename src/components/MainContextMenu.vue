<template>
  <div>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense tile>
        <v-list-item @click="openFormModal">
          <v-list-item-icon>
            <v-icon>add</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>New folder</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openUploadModal">
          <v-list-item-icon>
            <v-icon>upload_file</v-icon>
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
  import {mapActions, mapState} from 'vuex'

  export default {
    name: 'DocumentContextMenu',
    computed: {
      ...mapState({
        selectedItems: state => state.fileManager.selectedItems,
        current: state => state.fileManager.current,
      }),
    },
    data() {
      return {
        showMenu: false,
        x: 0,
        y: 0,
      }
    },
    methods: {
      ...mapActions({
        createFolder: 'fileManager/createFolder',
        editFolder: 'fileManager/editFolder',
        editFile: 'fileManager/editFile',
        resetSelectedFiles: 'fileManager/resetSelectedFiles',
        openUploadModal: 'fileManager/openUploadModal',
        openFormModal: 'fileManager/openFormModal',
      }),
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
