<template>
  <div>
    <div class="folder-section text-left" v-if="folders && folders.length">
      <h4>Folders</h4>
      <v-row>
        <v-col v-for="(item, index) in folders" :key="index" cols="3">
          <v-hover v-slot:default="{ hover }">
            <v-card class="pa-2 dir-card" :class="{'active': checkFolderSelected(item)}"
                    :elevation="hover ? 8 : 4" ref="folders" tile
                    @contextmenu.prevent.stop="showContextMenu(item, $event)"
                    @click.prevent.stop="selectFolder(item)"
                    @dblclick.stop.prevent="openFolder(item)">
              <v-list-item dense>
                <v-list-item-icon>
                  <v-icon large>mdi-folder</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </div>
    <folder-context-menu ref="folderContextMenu" :item="selectedFolder"/>
  </div>
</template>

<script>
  import FolderContextMenu from './FolderContextMenu'

  export default {
    components: {
      'folder-context-menu': FolderContextMenu
    },
    data() {
      return {
        selectedItem: {},
        showContext: false
      }
    },
    computed: {
      folders() {
        return this.$fileStore.state.folders
      },
      selectedFolder() {
        return this.$fileStore.state.selectedFolder
      },
    },
    methods: {
      getByFolder(payload) {
        this.$fileStore.dispatch('getByFolder', payload)
      },
      selectFolder(payload) {
        this.$fileStore.dispatch('selectFolder', payload)
      },
      openFolder(item) {
        this.getByFolder(item)
      },
      showContextMenu(item, e) {
        this.$emit('show-context-menu')
        this.selectFolder(item)
        this.$refs.folderContextMenu.showContextMenu(e)
      },
      hideContextMenu() {
        this.$refs.folderContextMenu.hideContextMenu()
      },
      checkFolderSelected(item) {
        return this.selectedFolder && item.id === this.selectedFolder.id
      }
    }
  }
</script>
<style>
  .dir-card.active {
    color: #4385f4 !important;
    background-color: #e5e5e5 !important;
    border: 1px solid #4385f4 !important
  }

  .dir-card:not(.active) {
    color: #000 !important;
    background-color: #fff !important;
    border: 1px solid #fff !important
  }
</style>
