<template>
  <div>
    <file-context-menu ref="fileContextMenu"/>
    <div class="file-section" v-if="files && files.length">
      <h4>Files</h4>
      <v-row>
        <v-col v-for="(item, index) in files" :key="index" cols="2">
          <v-hover v-slot:default="{ hover }">
            <v-card class="pa-2 file-card" :class="{'active': checkFileSelected(item)}" ref="files"
                    @click.stop="toggleFileSelect(item, $event)" :elevation="hover ? 8 : 4" tile
                    @dblclick.stop.prevent="download()"
                    @contextmenu.prevent.stop="showMenuContextFile(item, $event)">
              <v-card-text>
                <v-img src="/assets/pdf.png" alt=""></v-img>
              </v-card-text>
              <v-card-subtitle class="text-truncate">{{ item.name }}</v-card-subtitle>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import {formatSize} from '@/helpers/file'
  import FileContextMenu from './FileContextMenu'


  export default {
    components: {
      'file-context-menu': FileContextMenu
    },
    computed: {
      ...mapState({
        files: state => state.files,
        selectedItems: state => state.selectedFiles,
      }),
    },
    methods: {
      ...mapActions({
        resetSelectedFiles: 'resetSelectedFiles',
        removeFileSelected: 'removeFileSelected',
        addFileSelected: 'addFileSelected',
        download: 'download',
      }),
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
      showMenuContextFile(item, e) {
        this.$emit('show-context-menu')
        if (!this.checkFileSelected(item)) {
          this.resetSelectedFiles()
          this.addFileSelected(item);
        }
        this.$refs.fileContextMenu.showContext(e)
      },
      hideContextMenu() {
        this.$refs.fileContextMenu.hideContext()
      }
    }
  }
</script>

<style>
  .file-card.active {
    color: #4385f4;
    background-color: #e5e5e5;
    border: 1px solid #4385f4
  }

  .file-card:not(.active) {
    color: #000;
    background-color: #fff;
    border: 1px solid #fff
  }
</style>
