import Vue from "vue";
import Vuex from "vuex";
import states from "./states";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

Vue.use(Vuex)

export default new Vuex.Store( {
  namespaced: true,
  state() {
    return states
  },
  actions: actions,
  getters: getters,
  mutations: mutations
})
