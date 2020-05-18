import getByFolder from "../data/files";

export default {
  async getByFolder({ commit }, item) {
    let getEndpoint = this.$endpoints.get
    commit('LOADING')
    commit('UPDATE_BREADCRUMB', item);
    commit('UPDATE_CURRENT', item);
    await this.$axios({
      method: getEndpoint.method,
      url: getEndpoint.url,
      params: {
        folder_id: item && item.id
      }
    }).then(res => {
      commit('UPDATE_LIST', res)
      commit('UPDATE_CURRENT', res)
      commit('RESET_SEARCH');
      commit('RESET_SELECTED_FILES');
      commit('RESET_SELECTED_FOLDER');
    }).catch(error => {
      console.log(error)
      commit('UPDATE_LIST', getByFolder(item && item.id))
      commit('UPDATE_CURRENT', getByFolder(item && item.id)  )
      commit('RESET_SEARCH');
      commit('RESET_SELECTED_FILES');
      commit('RESET_SELECTED_FOLDER');
    })
    commit('UNLOADING');
  },
  selectFolder({ commit }, payload) {
    commit('RESET_SELECTED_FILES');
    commit('SELECT_FOLDER', payload);
  },
  resetSelectedFiles({commit}) {
    commit('RESET_SELECTED_FILES');
  },
  removeFileSelected({ commit }, payload) {
    commit('REMOVE_FILE_SELECTED', payload);
    commit('RESET_SELECTED_FOLDER');
  },
  addFileSelected({ commit }, payload) {
    commit('ADD_FILE_SELECTED', payload);
    commit('RESET_SELECTED_FOLDER');
  },
  async createFolder({ dispatch, commit}, payload) {
    commit('LOADING')
    let endpoint = this.$endpoints.createFolder

    await this.$axios({
      method: endpoint.method,
      url: endpoint.url,
      data: payload
    }).then(res => {
      console.log(res)
      dispatch('reload')
    }).catch(e => {console.log(e)});
    commit('UNLOADING');
  },
  async deleteFolder({ dispatch, commit }, payload) {
    commit('LOADING')
    let endpoint = this.$endpoints.deleteFolder

    await this.$axios({
      method: endpoint.method,
      url: endpoint.url,
      data: payload
    }).then(res => {
      console.log(res)
      dispatch('reload')
    }).catch(e => {console.log(e)});
    commit('UNLOADING');
  },
  async deleteSelected({ dispatch, commit }, payload) {
    commit('LOADING')
    let endpoint = this.$endpoints.download

    await this.$axios({
      method: endpoint.method,
      url: endpoint.url,
      data: payload
    }).then(res => {
      console.log(res)
      dispatch('reload')
    }).catch(e => {console.log(e)});
    commit('UNLOADING');
  },
  async editFolderName({ dispatch, commit }, payload) {
    commit('LOADING')
    let endpoint = this.$endpoints.editFolder

    await this.$axios({
      method: endpoint.method,
      url: endpoint.url,
      data: payload
    }).then(res => {
      console.log(res)
      dispatch('reload')
    }).catch(e => {console.log(e)});
    commit('UNLOADING');
  },
  async editFile({ commit, dispatch }, payload) {
    commit('LOADING')
    let endpoint = this.$endpoints.editFile

    await this.$axios({
      method: endpoint.method,
      url: endpoint.url,
      data: payload
    }).then(res => {
      console.log(res)
      dispatch('reload')
    }).catch(e => {console.log(e)});
    commit('UNLOADING');
  },
  openUploadModal({ commit }) {
    commit('OPEN_UPLOAD_MODAL')
  },
  hideUploadModal({ commit }) {
    commit('HIDE_UPLOAD_MODAL')
  },
  openFormModal({ commit }, createForm) {
    commit('OPEN_FORM_MODAL', createForm)
  },
  hideFormModal({ commit, dispatch }, reload) {
    commit('HIDE_FORM_MODAL')
    if (reload) {
      dispatch('reload')
    }
  },
  search({ commit }, payload) {
    commit('SEARCH', payload)
  },
  reload({ state, dispatch }) {
    if (state.keyword !== '') {
      dispatch('search', {keyword: state.keyword, filter: state.filter })
    } else {
      dispatch('getByFolder', state.current)
    }
  }
}
