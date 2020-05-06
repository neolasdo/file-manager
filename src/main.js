import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import axios from 'axios'
import vuetify from "./plugins/vuetify";
import Manager from '../../file-manager'

Vue.use(Vuex)
Vue.config.productionTip = false

const store = new Vuex.Store({})
const endpoints = {
  get: {
    url: 'index',
    method: 'get'
  },
  search: {
    url: 'search',
    method: 'get'
  },
  download: {
    url: 'download',
    method: 'post'
  },
  createFolder: {
    url: 'folder/create',
    method: 'post'
  },
  upload: {
    url: 'upload',
    method: 'post'
  },
  delete: {
    url: 'delete',
    method: 'delete'
  },
  editFolder: {
    url: 'folder/edit',
    method: 'put'
  },
  editFile: {
    url: 'file/edit',
    method: 'put'
  },
  deleteFolder: {
    url: 'folder/delete',
    method: 'delete'
  }
}
Vue.use(Manager, { store, axios, endpoints });

new Vue({
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
