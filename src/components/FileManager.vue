<template>
  <v-card class="mt-3">
    <file-toolbar/>
    <v-container class="pa-0">
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
            <span v-if="showDetail">Click to hide detail</span>
            <span v-if="!showDetail">Click to show detail</span>
          </v-tooltip>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text small v-on="on" light class="ml-2" tile>
                アクション <v-icon>mdi-sort</v-icon>
              </v-btn>
            </template>
            <v-list tile dense>
              <v-list-item>
                <v-list-item-title>署名依頼</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>承認依頼</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>ダウンロード</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>削除</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>

    <v-container style="background-color: #e0e0e0">
      <v-row>
        <v-col :cols="showDetail ? 9: 12">
          <v-container class="file-explorer" @click="onClickContainer()" @contextmenu.prevent="showMainContextMenu($event)">
            <folder-list ref="folderList" @show-context-menu="hideMainContextMenu()"/>
            <file-list ref="fileList" @show-context-menu="hideMainContextMenu()"/>
          </v-container>
          <main-context-menu ref="contextMenu"/>
        </v-col>
        <v-col v-if="showDetail" cols="3">
          <detail-card @close="showDetail=false"/>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <file-upload-modal ref="uploadModal"></file-upload-modal>
    <form-modal ref="formModal"></form-modal>
    <span class="pa-2 font-italic caption">Use CTRL + left mouse button click to select multiple file & folder</span>
  </v-card>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
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
    props: {
      employee_id: {
        type: Number,
        default: 0,
        required: false
      }
    },
    data() {
      return {
        showMenu: false,
        showDetail: false,
        x: 0,
        y: 0,
      }
    },
    computed: {
      ...mapState({
        breadcrumb: state => state.breadcrumb,
        list: state => state.list,
        selectedItems: state => state.selectedFiles,
        isLoading: state => state.isLoading,
        current: state => state.current,
      }),
      formattedBreadcrumb() {
        return this.breadcrumb.map(item => {
          item.disabled = item.id === this.current.id;
          return item;
        })
      },
    },
    methods: {
      ...mapActions({
        getByFolder: 'getByFolder',
        createFolder: 'createFolder',
        resetSelectedFiles: 'resetSelectedFiles',
      }),
      showMainContextMenu(e) {
        this.$refs.contextMenu.showContextMenu(e)
        this.$refs.folderList.hideContextMenu()
        this.$refs.fileList.hideContextMenu()
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
