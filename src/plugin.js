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
import ConfirmDialog from "./components/ConfirmDialog";
import vuetifyPlugin from "./plugins/vuetify";
import SnackBar from "./components/SnackBar";
import detail from "./configs/detail";
import sort from "./configs/sort";
import FileComments from "./components/FileComments";
import MoveFilesModal from "./components/MoveFilesModal";

let optionsDefaults = {
  endpoints: endpoints,
  axios: require('axios'),
  permissions: permissions,
  dict: lang,
  lang: 'en',
  accept_mimes: file.accept_mimes,
  accept_extensions: file.accept_extensions,
  sort: sort,
  detailConfig: detail,
  file_max_size: 25000000,
  autoReload: true,
  reloadPreviewAfter: 5000,
  hideNeedApprovalCheckBox: false
}
let Vue;

class Manager {
  store
  permissions
  config

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
    if (!Vue.prototype.$vuetify) {
      Vue.prototype.$vuetify = vuetifyPlugin
    }
    const options = this.mergeOptions(opts)
    let vuetify = Vue.prototype.$vuetify
    let config = {}
    /**
     * Register Snackbar
     * @type {ExtendedVue<Vue, any, any, any, Record<never, any>> | ExtendedVue<Vue, any, any, any, any> | ExtendedVue<Vue, {}, {}, {}, Record<never, any>> | ExtendedVue<Vue, {}, {}, {}, any> | ExtendedVue<Vue, {}, {}, {}, {}> | OptionsVue<Vue, any, any, any, Record<never, any>, any> | OptionsVue<Vue, any, any, any, any, any> | OptionsVue<Vue, {}, {}, {}, Record<never, any>, any> | OptionsVue<Vue, {}, {}, {}, any, any> | OptionsVue<Vue, {}, {}, {}, {}, Record<string, any>> | void}
     */
    const snackbar = Vue.extend(Object.assign({vuetify}, SnackBar))

    config.hideNeedApprovalCheckBox = options.hideNeedApprovalCheckBox
    Vue.prototype.$snackbar = function (message, options = {}) {
      options.message = message
      const container = document.querySelector('[data-app=true]') || document.body
      return new Promise(resolve => {
        const cmp = new snackbar(Object.assign({}, {
          propsData: Object.assign({}, options),
          destroyed: () => {
            container.removeChild(cmp.$el)
            resolve(true)
          }
        }))
        container.appendChild(cmp.$mount().$el)
      })
    }
    Vue.prototype.$endpoints = options.endpoints

    store.$axios = options.axios
    store.$snackbar = Vue.prototype.$snackbar
    store.$getEndpoint = function (name, meta = {}) {
      let endpoint = Object.assign({}, Vue.prototype.$endpoints[name])

      if (!endpoint) return {
        route: '',
        method: 'GET'
      }
      let varNames = endpoint.route.match(/:[^\s/]+/g)
      if (varNames && varNames.length) {
        varNames.forEach((item, index) => {
          if (meta[index]) {
            endpoint.route = endpoint.route.replace(item, meta[index])
          }
        })
      }
      return endpoint
    }
    config.dict = options.dict
    config.lang = options.lang
    Vue.prototype.$trans = function (key, replace = {}) {
      let currentLang = config.dict[config.lang]
      if (currentLang) {
        let tranRes = currentLang[key] ? currentLang[key] : key
        for (const [key, value] of Object.entries(replace)) {
          tranRes = tranRes.replace(":" + key, value)
        }
        return tranRes
      }
      return key
    }
    /**
     * Register confirm dialog
     * @type {ExtendedVue<Vue, any, any, any, Record<never, any>> | ExtendedVue<Vue, any, any, any, any> | ExtendedVue<Vue, {}, {}, {}, Record<never, any>> | ExtendedVue<Vue, {}, {}, {}, any> | ExtendedVue<Vue, {}, {}, {}, {}> | OptionsVue<Vue, any, any, any, Record<never, any>, any> | OptionsVue<Vue, any, any, any, any, any> | OptionsVue<Vue, {}, {}, {}, Record<never, any>, any> | OptionsVue<Vue, {}, {}, {}, any, any> | OptionsVue<Vue, {}, {}, {}, {}, Record<string, any>> | void}
     */
    const confirmDialog = Vue.extend(Object.assign({vuetify}, ConfirmDialog))

    Vue.prototype.$confirm = function (message, options = {}) {
      options.message = message
      options.buttonTrueText = options.buttonTrueText !== undefined ? options.buttonTrueText : Vue.prototype.$trans('yes')
      options.buttonFalseText = options.buttonFalseText !== undefined ? options.buttonFalseText : Vue.prototype.$trans('no')
      const container = document.querySelector('[data-app=true]') || document.body
      return new Promise(resolve => {
        const cmp = new confirmDialog(Object.assign({}, {
          propsData: Object.assign({}, options),
          destroyed: () => {
            container.removeChild(cmp.$el)
            resolve(cmp.value)
          }
        }))
        container.appendChild(cmp.$mount().$el)
      })
    }

    store.$trans = Vue.prototype.$trans
    store.$sortConfig = options.sort
    Vue.prototype.$fileStore = store;
    config.autoReloadPreview = options.autoReload;
    config.reloadPreviewAfter = options.reloadPreviewAfter;
    config.accept_mimes = options.accept_mimes;
    config.accept_extensions = options.accept_extensions;
    config.file_max_size = options.file_max_size;
    config.sortConfig = options.sort;
    config.detailConfig = options.detailConfig;
    Vue.prototype.$pluginConfig = config

    Vue.prototype.$getEndpoint = store.$getEndpoint;
    Vue.prototype.$permissions = options.permissions;
    this.store = store
    this.config = config
    this.permissions = options.permissions
  }

  mergeOptions(opts) {
    let options = {
      endpoints: {...optionsDefaults.endpoints, ...opts.endpoints},
      hideNeedApprovalCheckBox: opts.hideNeedApprovalCheckBox ? opts.hideNeedApprovalCheckBox : optionsDefaults.hideNeedApprovalCheckBox,
      axios: opts.axios ? opts.axios : optionsDefaults.axios,
      lang: opts.lang ? opts.lang : optionsDefaults.lang,
      autoReload: opts.autoReload !== undefined ? opts.autoReload : true,
      reloadPreviewAfter: opts.reloadPreviewAfter ? opts.reloadPreviewAfter : optionsDefaults.reloadPreviewAfter,
      permissions: {...optionsDefaults.permissions, ...opts.permissions},
      dict: optionsDefaults.dict,
      accept_mimes: [...optionsDefaults.accept_mimes, ...opts.accept_mimes],
      accept_extensions: {...optionsDefaults.accept_extensions, ...opts.accept_extensions},
      sort: {...optionsDefaults.sort, ...opts.sort},
      detailConfig: {...optionsDefaults.detailConfig, ...opts.detailConfig},
      file_max_size: opts.file_max_size ? opts.file_max_size : optionsDefaults.file_max_size,
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

    return options
  }

  getStore() {
    return this.store
  }

  updatePermission(config) {
    Vue.prototype.$permissions = {...this.permissions, ...config}
    this.permissions = Vue.prototype.$permissions
  }

  changeConfig(name, value) {
    Vue.prototype.$pluginConfig[name] = value
    this.config = Vue.prototype.$pluginConfig
  }

  changeEndpoint(name, opts = {}) {
    if (
      !Vue.prototype.$endpoints[name]) {
      throw new Error(`[file-manager] please init File Manager with endpoint ` + name)
    }
    let options = Vue.prototype.$endpoints[name]
    Vue.prototype.$endpoints[name] = {...options, ...opts};
  }

  validateOpts(opts) {
    if (opts) {
      return true
    }
    return false
  }
}


function install(_Vue) {
  if (Vue && _Vue === Vue) {
    {
      console.error(
        '[file manager] already installed. Vue.use(FileManager) should be called only once.'
      );
    }
    return
  }
  _Vue.component('detail-card', DetailCard)
  _Vue.component('file-comments', FileComments)
  _Vue.component('file-breadcrumb', FileBreadcrumb)
  _Vue.component('file-context-menu', FileContextMenu)
  _Vue.component('file-list', FileList)
  _Vue.component('file-manager', FileManager)
  _Vue.component('file-preview-modal', FilePreviewModal)
  _Vue.component('file-tool-bar', FileToolBar)
  _Vue.component('file-upload-modal', FileUploadModal)
  _Vue.component('folder-context-menu', FolderContextMenu)
  _Vue.component('folder-list', FolderList)
  _Vue.component('form-modal', FormModal)
  _Vue.component('main-context-menu', MainContextMenu)
  _Vue.component('move-file-modal', MoveFilesModal)
  _Vue.component('snack-bar', SnackBar)

  Vue = _Vue;
}

export default {
  Manager,
  install
}

export {
  FileComments,
  FilePreviewModal
}
