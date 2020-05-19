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
import lang from "@/lang";
import file from "./configs/file";

let optionsDefaults = {
  endpoints: endpoints,
  axios: require('axios'),
  permissions: permissions,
  dict: lang,
  lang: 'en',
  accept_mimes: file.accept_mimes,
  accept_extensions: file.accept_extensions
}
let Vue;
class Manager {
  store
  permissions

  constructor(opts = optionsDefaults) {
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue);
    }
    if (!Vue) {
      throw new Error(`[file-manager] must call Vue.use(FileManager) before creating a Manager instance.`);
    }
    if (!this.validateOpts(opts)) {
      throw new Error(`[file-manager] some config options is invalid!`);
    }
    const options =
      {
        endpoints: {...optionsDefaults.endpoints, ...opts.endpoints},
        axios: opts.axios ? opts.axios : optionsDefaults.axios,
        lang: opts.lang ? opts.lang : optionsDefaults.lang,
        permissions: {...optionsDefaults.permissions, ...opts.permissions},
        dict: optionsDefaults.dict,
        accept_mimes: [...optionsDefaults.accept_mimes, ...opts.accept_mimes],
        accept_extensions: {...optionsDefaults.accept_extensions, ...opts.accept_extensions}
      }

    if (opts.dict) {
      for (const [key, value] of Object.entries(opts.dict)) {
        if (!options.dict[key]) {
          options.dict[key] = value
        } else {
          options.dict[key] = {...options.dict[key], ...value}
        }
      }
    }

    store.$axios = options.axios
    store.$endpoints = options.endpoints
    Vue.prototype.$fileStore = store;
    Vue.prototype.$accept_mimes = options.accept_mimes;
    Vue.prototype.$accept_extensions = options.accept_extensions;
    Vue.prototype.$permissions = options.permissions;
    Vue.prototype.$dict = options.dict
    Vue.prototype.$lang = options.lang
    Vue.prototype.$trans = function(key) {
      let currentLang = Vue.prototype.$dict[Vue.prototype.$lang]
      if (currentLang) {
        return currentLang[key] ? currentLang[key] :key
      }
      return key
    }

    this.store = store
    this.permissions = options.permissions
  }

  getStore() {
    return this.store
  }

  updatePermission(config) {
    Vue.prototype.$permissions = {...this.permissions, ...config}
    this.permissions = Vue.prototype.$permissions
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
        '[file manager] already installed. Vue.use(FileManager) should be called only once.'
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
