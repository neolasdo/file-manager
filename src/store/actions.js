export default {
  async getByFolder({ commit }, item) {
    let getEndpoint = this.$endpoints.get
    commit('LOADING')
    commit('UPDATE_BREADCRUMB', item);
    commit('UPDATE_CURRENT', item);
    let response;
    let data = {}
    if (item && item.id) {
      data.folder_id = item.id
    }
    if (getEndpoint.method.toUpperCase() === 'GET') {
      response =  this.$axios.get(getEndpoint.url, {
        params: data
      })
    } else {
      response = this.$axios({
        method: getEndpoint.method,
        url: getEndpoint.url,
        data: data
      })
    }
    await response.then(res => {
      commit('UPDATE_LIST', res.data)
      commit('UPDATE_CURRENT', res.data)
      commit('RESET_SEARCH');
      commit('RESET_SELECTED_FILES');
      commit('RESET_SELECTED_FOLDER');
    }).catch(error => {
      console.log(error)
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
  addToClipboard({ commit }) {
    commit('ADD_FILES_TO_CLIPBOARD');
  },
  removeFileInClipboard({ commit }, payload) {
    commit('REMOVE_FILE_IN_CLIPBOARD', payload);
  },
  async moveFiles({ state, dispatch, commit }) {
    let currentFolder = state.current
    let clipboard = state.clipboard
    let endpoint = this.$endpoints.move
    commit('LOADING')

    let response;
    let data = {
      files: clipboard.map(item => {
        return item.id
      }),
      dest: currentFolder.id ? currentFolder.id : null
    }

    if (endpoint.method.toUpperCase() === 'GET') {
      response =  this.$axios.get(endpoint.url, {
        params: data
      })
    } else {
      response =  this.$axios({
        method: endpoint.method,
        url: endpoint.url,
        data: data
      })
    }
    await response.then(res => {
      console.log(res)
      dispatch('reload')
    }).catch(error => {
      console.log(error)
    })
    commit('RESET_CLIPBOARD');
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
