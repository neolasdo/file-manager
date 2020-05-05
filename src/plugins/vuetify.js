import Vue from "vue";
import Vuetify from "vuetify";
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    themes: {
      light: {
        primary: '#2296f3',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c',
        info: '#26A69A',
        warning: '#FFC107',
        success: '#00E676'
      },
      dark: {
        primary: '#2296f3',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c',
        info: '#26A69A',
        warning: '#FFC107',
        success: '#00E676'
      },
    },
  },
})
