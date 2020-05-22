<template>
  <div>
    <file-context-menu ref="fileContextMenu"/>
    <div class="file-section text-left" v-if="files && files.length">
      <h4>{{ $trans('files') }}</h4>
      <v-col cols="12">
        <v-row align="start" justify="start">
          <v-hover v-slot:default="{ hover }" v-for="(item, index) in files" :key="index">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-card class="pa-2 file-card ma-2" :class="{'active': checkFileSelected(item)}" ref="files"
                        @click.stop="toggleFileSelect(item, $event)" :elevation="hover ? 8 : 4" tile
                        @dblclick.stop.prevent="download()" v-on="on" width="180"
                        @contextmenu.prevent.stop="showContextMenu(item, $event)">
                  <v-chip x-small label class="status-label" v-if="item.size >= 1024 * 1024 * 1024" color="red" text-color="white">Too large</v-chip>
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
  </div>
</template>

<script>
  import {formatSize} from '@/helpers/file'
  import FileContextMenu from './FileContextMenu'
  import { getFileThumbnail} from "../helpers/file";


  export default {
    components: {
      'file-context-menu': FileContextMenu
    },
    computed: {
      files() {
        return this.$fileStore.state.files
      },
      selectedItems() {
        return this.$fileStore.state.selectedFiles
      }
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
      download() {
        let endpoint = this.$fileStore.$getEndpoint('download')

        this.$fileStore.$axios({
          method: endpoint.method,
          url: endpoint.route,
          data:  this.selectedItems.map(item => {
            return item.id
          })
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
        this.$emit('show-context-menu')
        if (!this.checkFileSelected(item)) {
          this.resetSelectedFiles()
          this.addFileSelected(item);
        }
        this.$refs.fileContextMenu.showContextMenu(e)
      },
      hideContextMenu() {
        this.$refs.fileContextMenu.hideContextMenu()
      }
    }
  }
</script>

<style>
  .file-card.active {
    color: #4385f4 !important;
    background-color: #e5e5e5 !important;
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
    top: -16px !important;
    right: 0 !important;
  }
</style>
