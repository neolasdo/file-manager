import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import fileStore from './store/store'
import vuetify from "./plugins/vuetify";
import endpoints from "./configs/endpoints";
import permissions from "./configs/permissions";
import axios from 'axios'


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

Vue.prototype.$fileStore = fileStore
Vue.prototype.$permissions = optionsDefaults.permissions;

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app')

