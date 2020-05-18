import store from "@/store/store";
import FileManager from "@/components/FileManager";
import DetailCard from "@/components/DetailCard";
import FileBreadcrumb from "@/components/FileBreadcrumb";
import FileContextMenu from "@/components/FileContextMenu";
import FileList from "@/components/FileList";
import FilePreviewModal from "@/components/FilePreviewModal";
import FileToolBar from "@/components/FileToolBar";
import FileUploadModal from "@/components/FileUploadModal";
import FolderContextMenu from "@/components/FolderContextMenu";
import FolderList from "@/components/FolderList";
import FormModal from "@/components/FormModal";
import MainContextMenu from "@/components/MainContextMenu";
import endpoints from "@/configs/endpoints";
import permissions from "@/configs/permissions";

let optionsDefaults = {
  endpoints: endpoints,
  axios: require('axios'),
  permissions: permissions
}
let Vue;
class Manager {
  store

  constructor(opts = optionsDefaults) {
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue);
    }
    if (!Vue) {
      throw new Error(`[file-manager] must call Vue.use(FileManager) before creating a Manager instance.`);
    }

    const options =
      {
        endpoints: {...optionsDefaults.endpoints, ...opts.endpoints},
        axios: opts.axios ? opts.axios : optionsDefaults.axios,
        permissions: {...optionsDefaults.permissions, ...opts.permissions},
      }

    if (!this.validateOpts(options)) {
      throw new Error(`[file-manager] some config option is invalid!`);
    }

    store.$axios = options.axios
    store.$endpoints = options.endpoints
    Vue.prototype.$fileStore = store;
    Vue.prototype.$permissions = options.permissions;
    this.store = store
  }

  getStore() {
    return this.store
  }

  updatePermission(config) {
    let permissions = Vue.prototype.$permissions

    Vue.prototype.$permissions = {...permissions, ...config}
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

  validateOpts(opts) {
    console.log(opts)
    return true
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
