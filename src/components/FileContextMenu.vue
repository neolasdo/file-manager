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
        <v-list-item v-if="selectedItems.length === 1 && $permissions.edit" @click="openFormModal()">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans('rename') }}</v-list-item-title>
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
        <v-list-item @click="addClipboard" v-if="$permissions.move">
          <v-list-item-icon>
            <v-icon>mdi-clipboard-plus-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans('add_to_clipboard') }}</v-list-item-title>
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
  </div>
</template>

<script>
  import {canPreview} from "@/helpers/file";
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

        this.$fileStore.$axios({
          method: endpoint.method,
          url: endpoint.route,
          data: {
            files: this.selectedItems.map(item => {
              return item.id
            })
          }
        }).then(res => {
          if (res.data && res.data.data && res.data.data.link) {
            const link = document.createElement('a')
            link.href = res.data.data.link
            link.setAttribute('target', '_blank') //or any other extension
            link.style.display = "none";
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        }).catch(errors => {
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
      preview() {
        if (this.selectedItems.length === 1) {
          this.$refs.filePreviewModal.showPreview(this.selectedItems[0])
        }
      }
    }
  }
</script>
