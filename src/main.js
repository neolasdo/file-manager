import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Vuex from 'vuex'
import states from './store/states'
import actions from './store/actions'
import getters from "./store/getters";
import mutations from "./store/mutations";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuex)
Vue.use(Vuetify)
const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    dark: {
      primary: '#3f51b5',
      secondary: '#b0bec5',
      accent: '#8c9eff',
      error: '#b71c1c',
      info: '#26A69A',
      warning: '#FFC107',
      success: '#00E676'
    }
  },
})
Vue.config.productionTip = false

const store = new Vuex.Store({
  state() {
    return states
  },
  actions: actions,
  getters: getters,
  mutations: mutations
})

new Vue({
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
