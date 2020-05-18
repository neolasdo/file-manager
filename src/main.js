import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import fileStore from './store/store'
import vuetify from "./plugins/vuetify";
import endpoints from "./configs/endpoints";
import permissions from "./configs/permissions";


let optionsDefaults = {
  endpoints: endpoints,
  axios: require('axios'),
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

