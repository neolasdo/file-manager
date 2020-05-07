import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import fileStore from './store/store'
import vuetify from "./plugins/vuetify";
import optionsDefaults from "./plugins/defaultOpts";

Vue.use(Vuex)
Vue.config.productionTip = false

fileStore.$endpoints = optionsDefaults.endpoints
fileStore.$axios = optionsDefaults.axios

Vue.prototype.$fileStore = fileStore

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app')

