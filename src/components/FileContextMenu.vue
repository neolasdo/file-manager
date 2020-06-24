<template>
    <div>
        <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
            <v-list dense tile>
                <v-list-item @click="preview" v-if="canPreview()">
                    <v-list-item-icon v-if="$permissions.view">
                        <v-icon>mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ $trans('preview') }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="download" v-if="$permissions.download">
                    <v-list-item-icon>
                        <v-icon>mdi-download</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ $trans('download') }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="addClipboard" v-if="$permissions.moveFile || $permissions.requestSign">
                    <v-list-item-icon>
                        <v-icon>mdi-clipboard-plus-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ $trans('add_to_clipboard') }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="move" v-if="$permissions.moveFile">
                    <v-list-item-icon>
                        <v-icon>mdi-file-move</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ $trans('move_to') }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="$emit('request-sign', selectedItems)" v-if="canRequestSign">
                    <v-list-item-icon>
                        <v-icon>mdi-signature-freehand</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ $trans('request_sign') }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="$emit('request-approval', selectedItems)" v-if="$permissions.approvalRequest">
                    <v-list-item-icon>
                        <v-icon>mdi-file-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ $trans('approval_request') }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="selectedItems.length === 1 && $permissions.edit" @click="openFormModal()">
                    <v-list-item-icon>
                        <v-icon>mdi-cursor-text</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ $trans('rename') }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="deleteAll()" v-if="$permissions.delete">
                    <v-list-item-icon>
                        <v-icon>mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ $trans('delete') }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>
        <file-preview-modal ref="filePreviewModal"/>
        <move-files-modal ref="moveModal"/>
    </div>
</template>

<script>
  import {canPreview} from "@/helpers/file";
  import FilePreviewModal from './FilePreviewModal'
  import MoveFilesModal from "./MoveFilesModal";

  export default {
    name: 'FileContextMenu',
    components: {
      'file-preview-modal': FilePreviewModal,
      'move-files-modal': MoveFilesModal
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
      canRequestSign() {
        let invalid = this.selectedItems.find(item => {
          return (item.is_official !== undefined && !item.is_official)
          || (item.count_signed_sign_request + item.count_pending_sign_request > 0)
        })
        return this.$permissions.requestSign && invalid === undefined
      }
    },
    methods: {
      deleteSelected() {
        this.$fileStore.dispatch('deleteSelected')
      },
      openFormModal(payload) {
        this.$fileStore.dispatch('openFormModal', payload)
      },
      addClipboard() {
        this.$fileStore.dispatch('addFilesToClipboard')
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
        let endpoint = this.$fileStore.$getEndpoint('download')
        this.$fileStore.dispatch('loading')

        this.$fileStore.$axios({
          method: endpoint.method,
          url: endpoint.route,
          data: {
            files: this.selectedItems.map(item => {
              return item.id
            })
          }
        }).then(res => {
          this.$fileStore.dispatch('unloading')
          if (res.data && res.data.data) {
            this.$fileStore.dispatch('loading')
            this.$fileStore.$axios.get(res.data.data.link, {responseType: 'blob'})
              .then(response => {
                this.$fileStore.dispatch('unloading')
                const blob = new Blob([response.data])
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.setAttribute('download', res.data.data.name)
                link.style.display = "none";
                document.body.appendChild(link)
                link.click()
                URL.revokeObjectURL(link.href)
                document.body.removeChild(link)
              })
              .catch((errors) => {
                if (errors.response && errors.response.data && errors.response.data.message) {
                  this.$snackbar(errors.response.data.message, {
                    color: 'error'
                  })
                }
                this.$fileStore.dispatch('unloading')
              })
          }
        }).catch(errors => {
          this.$fileStore.dispatch('unloading')
          if (errors.response && errors.response.data && errors.response.data.message) {
            this.$snackbar(errors.response.data.message, {
              color: 'error'
            })
          }
        })
      },
      hideContextMenu() {
        this.showMenu = false;
      },
      canPreview() {
        return this.selectedItems.length === 1 && canPreview(this.selectedItems[0])
      },
      deleteAll() {
        this.$confirm(this.$trans('confirm_delete_files'), {
          buttonTrueColor: 'error'
        }).then(res => {
          if (res) {
            this.deleteSelected()
          }
        })
      },
      move() {
        this.$refs.moveModal.showDialog()
      },
      preview() {
        if (this.selectedItems.length === 1) {
          this.$refs.filePreviewModal.showPreview(this.selectedItems[0])
        }
      }
    }
  }
</script>
