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
                <v-list-item @click="move" v-if="$permissions.moveFile">
                    <v-list-item-icon>
                        <v-icon>mdi-file-move</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ $trans('move_to') }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="requestSign()" v-if="$permissions.requestSign">
                    <v-list-item-icon>
                        <v-icon>mdi-signature-freehand</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ $trans('request_sign') }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="requestApproval()" v-if="$permissions.approvalRequest">
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
    computed: {
      selectedItems() {
        return this.$fileStore.state.selectedFiles
      },
      x() {
        return this.$fileStore.state.pointerEvent.x
      },
      y() {
        return this.$fileStore.state.pointerEvent.y
      },
      showMenu: {
        get: function () {
          return this.$fileStore.state.showFileContext
        },
        set: function (newValue) {
          if (!newValue) {
            this.$fileStore.dispatch('hideContext')
          }
        }
      },
    },
    methods: {
      deleteSelected() {
        this.$fileStore.dispatch('deleteSelected')
      },
      openFormModal(payload) {
        this.$fileStore.dispatch('openFormModal', payload)
      },
      requestSign() {
        this.$fileStore.dispatch('addSignFilesRequest', this.selectedItems)
        this.$fileStore.dispatch('showRequestModal', 'sign')
      },
      requestApproval() {
        this.$fileStore.dispatch('addApprovalFilesRequest', this.selectedItems)
        this.$fileStore.dispatch('showRequestModal', 'approval')
        
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
            window.open(res.data.data.link, '_self');
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
