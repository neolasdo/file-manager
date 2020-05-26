<template>
  <v-app class="file-manager-app">
    <v-card class="mt-3">
      <file-toolbar>
        <template v-slot:searchFilter="slotProps">
          <slot name="searchFilter" v-bind:filter="slotProps.filter">
          </slot>
        </template>
        <template v-slot:additionMenuItem="slotProps">
          <slot name="additionMenuItem" v-bind:selectedFiles="slotProps.selectedFiles">
          </slot>
        </template>
      </file-toolbar>
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col cols="6">
            <file-breadcrumb :breadcrumb="formattedBreadcrumb"/>
          </v-col>
          <v-col cols="6" class="pa-2 text-right">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon small dark active-class="active" v-on="on" :color="showDetail ? 'primary': 'secondary'" @click="showDetail = !showDetail">
                  <v-icon>mdi-information-outline</v-icon>
                </v-btn>
              </template>
              <span v-if="showDetail">{{ $trans('click_hide_detail') }}</span>
              <span v-if="!showDetail">{{ $trans('click_show_detail') }}</span>
            </v-tooltip>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn text small v-on="on" light class="ml-2" tile>
                  {{ sortLabel }} <v-icon>{{ sortType === '' ? 'mdi-sort' : (sortType.toUpperCase() === 'ASC' ? 'mdi-sort-ascending' : 'mdi-sort-descending') }}</v-icon>
                </v-btn>
              </template>
              <v-list tile dense>
                <v-list-item v-for="item in $sortConfig.fields" :key="item.key" @click="changeSort(item.key)">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.label }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action v-if="sortKey === item.key && sortType">
                    <v-btn icon>
                      <v-icon color="grey lighten-1">{{ sortType.toUpperCase() === 'ASC' ? 'mdi-sort-descending' : 'mdi-sort-ascending' }}</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>

      <v-container fluid style="background-color: #e5e5e5">
        <v-row>
          <v-col :cols="showDetail ? 6: 12" :md="showDetail ? 9: 12" :sm="showDetail ? 8: 12">
            <v-container fluid class="file-explorer" @click="onClickContainer()" @contextmenu.prevent="showMainContextMenu($event)">
              <v-alert v-if="files.length === 0 && folders.length === 0" text color="info">
                <h3>{{ $trans('empty_folder') }}</h3>
              </v-alert>
              <folder-list ref="folderList" @show-context-menu="showFolderContextMenu()"/>
              <file-list ref="fileList" @show-context-menu="showFileContextMenu()"/>
            </v-container>
            <main-context-menu ref="contextMenu"/>
          </v-col>
          <v-col v-if="showDetail" cols="6" md="3" sm="4">
            <detail-card @close="showDetail=false"/>
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <file-upload-modal ref="uploadModal"></file-upload-modal>
      <form-modal ref="formModal"></form-modal>
      <span class="pa-2 font-italic caption">{{ $trans('select_multi_helper') }}</span>
    </v-card>
  </v-app>
</template>

<script>
  import FileToolBar from './FileToolBar'
  import FileBreadcrumb from './FileBreadcrumb'
  import FolderList from './FolderList'
  import FileList from './FileList'
  import MainContextMenu from "./MainContextMenu"
  import DetailCard from "./DetailCard";
  import FileUploadModal from "./FileUploadModal";
  import FormModal from "./FormModal";

  export default {
    name: 'FileManager',
    components: {
      'main-context-menu': MainContextMenu,
      'detail-card': DetailCard,
      'file-toolbar' : FileToolBar,
      'file-breadcrumb' : FileBreadcrumb,
      'folder-list' : FolderList,
      'file-list' : FileList,
      'file-upload-modal': FileUploadModal,
      'form-modal': FormModal,
    },
    data() {
      return {
        showMenu: false,
        showDetail: true,
        x: 0,
        y: 0,
      }
    },
    computed: {
      formattedBreadcrumb() {
        return this.$fileStore.state.breadcrumb.map(item => {
          item.disabled = item.id === this.current.id;
          return item;
        })
      },
      files() {
        return this.$fileStore.state.files
      },
      folders() {
        return this.$fileStore.state.folders
      },
      sortKey() {
        return this.$fileStore.state.sortKey
      },
      sortType() {
        return this.$fileStore.state.sortType
      },
      sortLabel() {
        let key = this.$fileStore.state.sortKey
        let index = this.$sortConfig.fields.findIndex(item => {
          return item.key === key
        })
        if (index !== -1) {
          return this.$sortConfig.fields[index].label
        }
        return this.$trans('sort')
      },
      selectedItems() {
        return this.$fileStore.state.selectedFiles
      },
      isLoading() {
        return this.$fileStore.state.isLoading
      },
      current() {
        return this.$fileStore.state.current
      },
      keywordState() {
        return this.$fileStore.state.keyword
      },
    },
    methods: {
      getByFolder(payload) {
        this.$fileStore.dispatch('getByFolder', payload)
      },
      createFolder(payload) {
        this.$fileStore.dispatch('createFolder', payload)
      },
      resetSelectedFiles() {
        this.$fileStore.dispatch('resetSelectedFiles')
      },
      changeSort(key) {
        let type = 'ASC'
        if (this.sortKey === key) {
          type = this.sortType.toUpperCase() === 'ASC' ? 'DESC' : 'ASC'
        }
        this.$fileStore.dispatch('changeSort', { sortKey: key, sortType: type })
      },
      showMainContextMenu(e) {
        if (this.keywordState === '') {
          this.$refs.contextMenu.showContextMenu(e)
          this.$refs.folderList.hideContextMenu()
          this.$refs.fileList.hideContextMenu()
        }
      },
      showFolderContextMenu() {
        this.$refs.contextMenu.hideContextMenu()
        this.$refs.fileList.hideContextMenu()
      },
      showFileContextMenu() {
        this.$refs.contextMenu.hideContextMenu()
        this.$refs.folderList.hideContextMenu()
      },
      hideMainContextMenu() {
        this.$refs.contextMenu.hideContextMenu()
      },
      onClickContainer() {
        this.hideMainContextMenu()
        this.resetSelectedFiles()
      }
    },
    beforeMount() {
      this.getByFolder()
    }
  }
</script>
<style>
  .file-explorer {
    height: 500px;
    overflow-y: auto;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .file-explorer::-webkit-scrollbar {
    width: 10px;
  }

  .file-explorer::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .file-explorer::-webkit-scrollbar-thumb {
    background: #888;
  }

  .file-explorer::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
