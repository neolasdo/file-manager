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

let optionsDefaults = {
  endpoints: endpoints,
  axios: axios.create({
    baseURL: 'http://localhost:8001'
  }),
  permissions: permissions
}

Vue.use(Vuex)
Vue.config.productionTip = false

fileStore.$endpoints = optionsDefaults.endpoints
fileStore.$axios = optionsDefaults.axios

Vue.prototype.$dict = lang
Vue.prototype.$lang = 'en'

Vue.prototype.$accept_mimes = file.accept_mimes;
Vue.prototype.$accept_extensions = file.accept_extensions;

Vue.prototype.$trans = function(key) {
  let currentLang = Vue.prototype.$dict[Vue.prototype.$lang]
  if (currentLang) {
    return currentLang[key] ? currentLang[key] :key
  }
  return key
}

Vue.prototype.$fileStore = fileStore
Vue.prototype.$permissions = optionsDefaults.permissions;

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app')

