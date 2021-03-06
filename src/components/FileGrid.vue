<template>
    <div>
      <div class="file-section text-left" v-if="files && files.length">
          <h4 cla>{{ $trans('files') }}</h4>
          <v-col cols="12">
              <v-row align="start" justify="start">
                  <v-hover v-slot:default="{ hover }" v-for="(item, index) in files" :key="index">
                      <v-tooltip bottom z-index="7">
                          <template v-slot:activator="{ on }">
                              <v-card class="pa-2 file-card ma-2" ref="files"
                                      :class="{'active': checkFileSelected(item)}"
                                      @click.stop="toggleFileSelect(item, $event)" :elevation="hover ? 8 : 4" tile
                                      @dblclick.stop.prevent="preview" v-on="on" width="180"
                                      @contextmenu.prevent.stop="showContextMenu(item, $event)">
                                  <v-overlay absolute color="#969696"
                                              :value="item.is_official !== undefined && !item.is_official"></v-overlay>
                                  <v-chip small label class="status-label" v-if="item.label" style="border-radius: 0 !important;"
                                          :color="item.label_color" text-color="white">{{item.label}}
                                  </v-chip>
                                  <v-card-text>
                                      <v-img :src="fileThumbnail(item)" alt=""></v-img>
                                      <h4 class="text-truncate pt-3 file-name">{{ item.name }}</h4>
                                  </v-card-text>
                              </v-card>
                          </template>
                          <span>{{ item.name }}</span>
                      </v-tooltip>
                  </v-hover>
              </v-row>
          </v-col>
      </div>
      <file-preview-modal ref="filePreviewModal"/>
    </div>
</template>

<script>
  import {formatSize} from '@/helpers/file'
  import {canPreview, getFileThumbnail} from "../helpers/file";
  import FilePreviewModal from "./FilePreviewModal";


  export default {
    components: {
      'file-preview-modal': FilePreviewModal,
    },
    computed: {
      files() {
        return this.$fileStore.state.files
      },
      view() {
        return this.$fileStore.state.view
      },
      selectedItems() {
        return this.$fileStore.state.selectedFiles
      }
    },
    methods: {
      getLabel(item) {
        if (item.count_pending_approval_request > 0) {
          return this.$trans('approval_request_pending')
        }
        if (item.count_pending_sign_request > 0) {
          return this.$trans('sign_request_pending')
        }
        if (item.count_signed_sign_request > 0) {
          return this.$trans('sign_request_signed')
        }
      },
      getLabelColor(item) {
        if (item.count_signed_sign_request > 0) {
          return 'success'
        }
        return 'primary'
      },
      resetSelectedFiles() {
        this.$fileStore.dispatch('resetSelectedFiles')
      },
      removeFileSelected(payload) {
        this.$fileStore.dispatch('removeFileSelected', payload)
      },
      addFileSelected(payload) {
        this.$fileStore.dispatch('addFileSelected', payload)
      },
      fileThumbnail(item) {
        return getFileThumbnail(item)
      },
      preview() {
        if (this.selectedItems.length === 1 && canPreview(this.selectedItems[0])) {
          this.$refs.filePreviewModal.showPreview(this.selectedItems[0])
        }
      },
      checkFileSelected(item) {
        let index = this.selectedItems.findIndex(element => {
          return element.id === item.id;
        });
        return index !== -1
      },
      formatSize(size) {
        return formatSize(size);
      },
      toggleFileSelect(item, e) {
        if (!e.ctrlKey) {
          this.resetSelectedFiles()
        }
        let index = this.selectedItems.findIndex(element => {
          return element.id === item.id;
        });
        if (index !== -1) {
          this.removeFileSelected(index)
        } else {
          this.addFileSelected(item);
        }
      },
      showContextMenu(item, e) {
        if (!this.checkFileSelected(item)) {
          this.resetSelectedFiles()
          this.addFileSelected(item);
        }
        this.$fileStore.dispatch('showFileContextMenu', {
          x: e.clientX,
          y: e.clientY
        })
      },
    }
  }
</script>

<style>
    .file-card.active {
        color: #4385f4 !important;
        background-color: #E8F0FE !important;
        border: 1px solid #4385f4 !important
    }

    .file-card:not(.active) {
        color: #000 !important;
        background-color: #fff !important;
        border: 1px solid #fff !important
    }

    h4.file-name {
        font-size: 1em !important;
        font-weight: bold;
    }

    .status-label {
        position: absolute !important;
        top: 0px !important;
        right: 0 !important;
        z-index: 6;
        font-size: 13px;
    }
</style>
