<template>
  <div>
    <v-list two-line subheader dense v-if="files && files.length">
      <v-subheader>{{ $trans('files') }}</v-subheader>

      <v-list-item 
        v-for="(item, index) in files" class="file-item"
        :key="index" :class="{'active': checkFileSelected(item)}"
        @contextmenu.prevent.stop="showContextMenu(item, $event)"
        @click.stop="toggleFileSelect(item, $event)"
        @dblclick.stop.prevent="preview"
      >
      <v-overlay absolute color="#969696" :value="item.is_official !== undefined && !item.is_official"></v-overlay>
        <v-list-item-avatar tile>
          <v-img :src="fileThumbnail(item)" alt=""></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title> 
              {{item.name}}
          </v-list-item-title>
          <v-list-item-subtitle v-text="item.created_at"></v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-list-item-action-text class="text-right">
            <strong v-if="item.label" :class="item.label_color+'--text'">{{item.label}}</strong><br>
            <strong>{{formatSize(item.size)}}</strong><br>
          </v-list-item-action-text>
        </v-list-item-action>
      </v-list-item>
    </v-list>
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
      },
    },
    methods: {
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
        if (this.selectedItems.length === 1 && canPreview(this.selectedItems[0].mime ? this.selectedItems[0].mime: this.selectedItems[0].file_mime)) {
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
  .file-item.active {
      color: #4385f4 !important;
      background-color: #E8F0FE !important;
  }

  .file-item:not(.active){
      color: #000 !important;
      background-color: #fff !important;
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
