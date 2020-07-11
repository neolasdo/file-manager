<template>
    <v-app class="file-manager-app">
        <v-card class="file-manage-card">
            <file-toolbar/>
            <v-container fluid class="pa-0" style="border-bottom: 1px solid #a5a5a5;">
                <v-row no-gutters>
                    <v-col cols="6">
                        <file-breadcrumb :breadcrumb="formattedBreadcrumb"/>
                    </v-col>
                    <v-col cols="6" class="pa-2 text-right">
                         <v-btn icon small @click="gridView = !gridView">
                              <v-icon>{{gridView ? 'mdi-view-list' : 'mdi-view-grid'}}</v-icon>
                          </v-btn>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon small dark active-class="active" v-on="on" class="ml-2"
                                       :color="showDetail ? 'primary': 'secondary'" @click="showDetail = !showDetail">
                                    <v-icon>mdi-information-outline</v-icon>
                                </v-btn>
                            </template>
                            <span v-if="showDetail">{{ $trans('click_hide_detail') }}</span>
                            <span v-if="!showDetail">{{ $trans('click_show_detail') }}</span>
                        </v-tooltip>
                        <v-menu offset-y z-index="11">
                            <template v-slot:activator="{ on }">
                                <v-btn text small v-on="on" light class="ml-2" tile>
                                    {{ sortLabel }}
                                    <v-icon>{{ sortType === '' ? 'mdi-sort' : (sortType.toUpperCase() === 'ASC' ?
                                        'mdi-sort-ascending' : 'mdi-sort-descending') }}
                                    </v-icon>
                                </v-btn>
                            </template>
                            <v-list tile dense>
                                <v-list-item v-for="item in $sortConfig.fields" :key="item.key"
                                             @click="changeSort(item.key)">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.label }}</v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-action v-if="sortKey === item.key && sortType">
                                        <v-btn icon>
                                            <v-icon color="grey lighten-1">{{ sortType.toUpperCase() === 'ASC' ?
                                                'mdi-sort-descending' : 'mdi-sort-ascending' }}
                                            </v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-col>
                </v-row>
            </v-container>

            <v-container fluid class="context-area pa-0">
                <v-overlay :value="loading" absolute z-index="11">
                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay>
                <v-container fluid class="file-explorer pa-0" @click="onClickContainer()" @contextmenu.prevent="showMainContextMenu($event)">
                  <v-alert v-if="files.length === 0 && folders.length === 0 && !loading && loaded" text color="info">
                      <h3>{{ isSearching ? $$trans('search_empty') :$trans('empty_folder') }}</h3>
                  </v-alert>
                  <grid-view v-if="gridView"/>
                  <list-view v-else/>
                </v-container>
                <main-context-menu ref="contextMenu"/>
                <folder-context-menu ref="folderContextMenu"/>
                <file-context-menu ref="fileContextMenu"/>
                <div v-if="showDetail" class="sidebar-detail">
                  <detail-card @close="showDetail=false"/>
                </div>
            </v-container>
            <file-upload-modal ref="uploadModal"></file-upload-modal>
            <form-modal ref="formModal"></form-modal>
        </v-card>
    </v-app>
</template>

<script>
  import FileToolBar from './FileToolBar'
  import FileBreadcrumb from './FileBreadcrumb'
  import FileContextMenu from './FileContextMenu'
  import MainContextMenu from "./MainContextMenu"
  import DetailCard from "./DetailCard";
  import FileUploadModal from "./FileUploadModal";
  import FormModal from "./FormModal";
  import ListView from "./ListView";
  import GridView from "./GridView";
  import FolderContextMenu from './FolderContextMenu'

  export default {
    name: 'FileManager',
    components: {
      'main-context-menu': MainContextMenu,
      'detail-card': DetailCard,
      'file-toolbar': FileToolBar,
      'file-breadcrumb': FileBreadcrumb,
      'file-upload-modal': FileUploadModal,
      'form-modal': FormModal,
      'list-view': ListView,
      'grid-view': GridView,
      'file-context-menu': FileContextMenu,
      'folder-context-menu': FolderContextMenu
    },
    data() {
      return {
        showMenu: false,
        gridView: true,
        showDetail: false,
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
      loading() {
        return this.$fileStore.state.isLoading
      },
      loaded() {
        return this.$fileStore.state.loaded
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
        return ''
      },
      selectedItems() {
        return this.$fileStore.state.selectedFiles
      },
      current() {
        return this.$fileStore.state.current
      },
      keywordState() {
        return this.$fileStore.state.keyword
      },
      isSearching() {
        return this.$fileStore.state.isSearching
      }
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
        this.$fileStore.dispatch('changeSort', {sortKey: key, sortType: type})
      },
      showMainContextMenu(e) {
        if (this.keywordState === '') {
          this.$fileStore.dispatch('showMainContextMenu', {
            x: e.clientX,
            y: e.clientY
          })
        }
      },
      hideMainContextMenu() {
        this.$fileStore.dispatch('hideContext')
      },
      onClickContainer() {
        this.$fileStore.dispatch('hideContext')
      },
    },
    beforeMount() {
      this.getByFolder()
    },
    beforeDestroy() {
      this.$fileStore.dispatch('resetState')
    }
  }
</script>
<style>
    .file-explorer {
        height: 100%;
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

    .file-manage-card {
        height: 100%;
    }

    .context-area {
        background-color: #e5e5e5;
        height: calc(100% - 93px);
        position: relative;
    }

    .section-r {
        width: 100%;
        position: absolute;
        height: 100%;
        top: 0;
    }

    .sidebar-detail {
      height: 100% !important;
      position: absolute;
      z-index: 10;
      right: 0;
      top: 0;
      max-width: 300px;
      min-width: 250px;
    }
</style>
