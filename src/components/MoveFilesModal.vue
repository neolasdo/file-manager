<template>
    <v-dialog v-model="dialog" scrollable max-width="300px">
        <v-card>
            <v-card-title>
                <v-btn icon @click="getFolders(current.parent_id)" v-if="current.parent_id">
                    <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn>
                {{ current.name }}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 300px;" class="pa-0">
                <v-list>
                    <v-list-item-group v-model="dest" color="primary">
                        <v-list-item v-for="item in folders" :key="item.id" :disabled="item.id === currentFolder.id">
                            <v-list-item-icon>
                                <v-icon>mdi-folder</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.name"></v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action v-if="item.hasChildren || (item.children && item.children.length)">
                                <v-btn icon @click="getFolders(item.id)">
                                    <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="blue darken-1" text @click="closeModal">{{ $trans('close') }}</v-btn>
                <v-btn color="blue darken-1" text :disabled="!folders[dest] && current.id === currentFolder.id" @click="moveFiles">{{ $trans('move') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    data() {
      return {
        reload: false,
        loading: false,
        dialog: false,
        dest: undefined,
        current: {},
        folders: []
      }
    },
    methods: {
      closeModal() {
        this.dialog = false
        this.folders = []
      },
      async getFolders(folderId) {
        this.loading = true
        let endpoint = this.$fileStore.$getEndpoint('get')
        let data = {}
        if (folderId) {
          data.folder_id = folderId
        }
        let response
        if (endpoint.method.toUpperCase() === 'GET') {
          response = this.$fileStore.$axios.get(endpoint.route, {
            params: data
          })
        } else {
          response = this.$fileStore.$axios({
            method: endpoint.method,
            url: endpoint.route,
            data: data
          })
        }
        await response.then(res => {
          this.current = res.data.data;
          this.folders = this.current.children
          this.loading = false
        }).catch(error => {
          this.loading = false
          let errMess = this.$trans('server_error')
          if (error.response && error.response.data && error.response.data.message) {
            errMess = error.response.data.message
          }
          if (error.data && error.data.message) {
            errMess = error.data.message
          }
          this.$fileStore.$snackbar(errMess, {
            color: 'error'
          })
        })
      },
      showDialog() {
        this.dialog = true
        this.getFolders();
        return this.$fileStore.state.showUploadModal
      },
      moveFiles() {
        this.$fileStore.dispatch('moveFiles', {
          id: this.folders[this.dest] ? this.folders[this.dest].id : this.current.id,
          files: this.selectedFiles,
          folder: this.selectedFolder
        })
        this.closeModal()
      },
    },
    computed: {
      selectedFiles() {
        return this.$fileStore.state.selectedFiles
      },
      selectedFolder() {
        return this.$fileStore.state.selectedFolder
      },
      currentFolder() {
        return this.$fileStore.state.current
      },
    },
  }
</script>
