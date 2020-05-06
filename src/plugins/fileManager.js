import optionsDefaults from "./defaultOpts";
import FileManager from "../components/FileManager";
import DetailCard from "../components/DetailCard";
import FileBreadcrumb from "../components/FileBreadcrumb";
import FileContextMenu from "../components/FileContextMenu";
import FileList from "../components/FileList";
import FilePreviewModal from "../components/FilePreviewModal";
import FileToolBar from "../components/FileToolBar";
import FileUploadModal from "../components/FileUploadModal";
import FolderContextMenu from "../components/FolderContextMenu";
import FolderList from "../components/FolderList";
import FormModal from "../components/FormModal";
import MainContextMenu from "../components/MainContextMenu";

import store from "../store/store";

export default {
  install(Vue, opts) {
    const options = {...optionsDefaults, ...opts}
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }
    if (!options.endpoints ||
      !options.endpoints.get ||
      !options.endpoints.search ||
      !options.endpoints.download ||
      !options.endpoints.createFolder ||
      !options.endpoints.upload ||
      !options.endpoints.delete ||
      !options.endpoints.editFolder ||
      !options.endpoints.editFile ||
      !options.endpoints.deleteFolder
    ) {
      throw new Error('Please initialise plugin with endpoints list (get, search, download, createFolder, upload, delete, editFolder, editFile, deleteFolder).')
    }
    store.$axios = options.axios
    store.$endpoints = options.endpoints
    Vue.prototype.$fileStore = store;
    Vue.component('file-manager', FileManager)
    Vue.component('detail-card', DetailCard)
    Vue.component('file-breadcrumb', FileBreadcrumb)
    Vue.component('file-context-menu', FileContextMenu)
    Vue.component('file-list', FileList)
    Vue.component('file-preview-modal', FilePreviewModal)
    Vue.component('file-tool-bar', FileToolBar)
    Vue.component('file-upload-modal', FileUploadModal)
    Vue.component('folder-context-menu', FolderContextMenu)
    Vue.component('folder-list', FolderList)
    Vue.component('form-modal', FormModal)
    Vue.component('main-context-menu', MainContextMenu)
  }
}
