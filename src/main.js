import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import fileStore from './store/store'
import vuetify from "./plugins/vuetify";
import endpoints from "./configs/endpoints";
import permissions from "./configs/permissions";
import axios from 'axios'
import lang from './lang'
import file from "./configs/file";
import ConfirmDialog from "./components/ConfirmDialog";
import SnackBar from "./components/SnackBar";
import detail from "./configs/detail";
import sort from "./configs/sort";

let optionsDefaults = {
  endpoints: endpoints,
  axios: axios.create({
    baseURL: 'http://localhost:8001'
  }),
  permissions: permissions,
  previewType: 'google',
  sort: sort,
  detailConfig: detail,
  hideNeedApprovalCheckBox: true
}

Vue.config.productionTip = false

let config = {}

config.dict = lang
config.hideNeedApprovalCheckBox = optionsDefaults.hideNeedApprovalCheckBox
config.lang = 'en'

config.accept_mimes = file.accept_mimes;
config.accept_extensions = file.accept_extensions;
config.file_max_size = file.file_max_size;

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

const confirmDialog = Vue.extend(Object.assign({vuetify}, ConfirmDialog))

function createDialogConfirm(options) {
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

Vue.prototype.$confirm = function (message, options = {}) {
  options.message = message
  options.buttonTrueText = options.buttonTrueText !== undefined ? options.buttonTrueText : Vue.prototype.$trans('yes')
  options.buttonFalseText = options.buttonFalseText !== undefined ? options.buttonFalseText : Vue.prototype.$trans('no')
  return createDialogConfirm(options)
}

const snackbar = Vue.extend(Object.assign({vuetify}, SnackBar))

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
Vue.use(Vuex)
fileStore.$trans = Vue.prototype.$trans
Vue.prototype.$endpoints = optionsDefaults.endpoints

fileStore.$getEndpoint = function (name, meta = []) {
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

fileStore.$axios = optionsDefaults.axios
fileStore.$snackbar = Vue.prototype.$snackbar
Vue.prototype.$fileStore = fileStore
config.autoReloadPreview = true;
config.reloadPreviewAfter = 5000;
Vue.prototype.$getEndpoint = fileStore.$getEndpoint
Vue.prototype.$axios = fileStore.$axios;
Vue.prototype.$permissions = optionsDefaults.permissions;
config.sortConfig = optionsDefaults.sort;
config.previewType = 'google'
config.detailConfig = optionsDefaults.detailConfig;
Vue.prototype.$pluginConfig = config

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app')

