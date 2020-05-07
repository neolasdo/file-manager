import optionsDefaults from "./defaultOpts";
import store from "../store/store";
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

let Vue;
class Manager {
  store

  constructor(opts = optionsDefaults) {
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue);
    }
    if (!Vue) {
      throw new Error(`[file-manager] must call Vue.use(Vuex) before creating a store instance.`);
    }

    const options = {...optionsDefaults, ...opts}

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
    this.store = store
  }

  changeEndpoint(name, opts = {}) {
    let endpoints = Vue.prototype.$fileStore.$endpoints;
    if (!endpoints[name]) {
      throw new Error(`[file-manager] please init File Manager with endpoint `+ name)
    }
    endpoints[name] = opts;
    Vue.prototype.$fileStore.$endpoints = endpoints
  }

  getEndpoints() {
    return Vue.prototype.$fileStore.$endpoints
  }
}


function install (_Vue) {
  if (Vue && _Vue === Vue) {
    {
      console.error(
        '[file manager] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  _Vue.component('file-manager', FileManager)
  _Vue.component('detail-card', DetailCard)
  _Vue.component('file-breadcrumb', FileBreadcrumb)
  _Vue.component('file-context-menu', FileContextMenu)
  _Vue.component('file-list', FileList)
  _Vue.component('file-preview-modal', FilePreviewModal)
  _Vue.component('file-tool-bar', FileToolBar)
  _Vue.component('file-upload-modal', FileUploadModal)
  _Vue.component('folder-context-menu', FolderContextMenu)
  _Vue.component('folder-list', FolderList)
  _Vue.component('form-modal', FormModal)
  _Vue.component('main-context-menu', MainContextMenu)

  Vue = _Vue;
}

export default {
  Manager,
  install
}
