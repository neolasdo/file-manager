export default {
  async getByFolder({commit}, item) {
    let getEndpoint = this.$getEndpoint('get')
    commit('LOADING')
    commit('UPDATE_BREADCRUMB', item);
    commit('UPDATE_CURRENT', item);
    let data = {}
    if (item && item.id) {
      data.folder_id = item.id
    }
    let response = executeAxios(this.$axios, getEndpoint, data)

    await response.then(res => {
      commit('UPDATE_LIST', res.data.data)
      commit('UPDATE_CURRENT', res.data.data)
      commit('RESET_SEARCH');
      commit('RESET_SELECTED_FILES');
      commit('RESET_SELECTED_FOLDER');
    }).catch(error => {
      let errMess = this.$trans('server_error')
      if (error.response && error.response.data && error.response.data.message) {
        errMess = error.response.data.message
      }
      this.$snackbar(errMess, {
        color: 'error'
      })
      commit('RESET_SEARCH');
      commit('RESET_SELECTED_FILES');
      commit('RESET_SELECTED_FOLDER');
    })
    commit('UNLOADING');
  },
  selectFolder({commit}, payload) {
    commit('RESET_SELECTED_FILES');
    commit('SELECT_FOLDER', payload);
  },
  resetSelectedFiles({commit}) {
    commit('RESET_SELECTED_FILES');
  },
  removeFileSelected({commit}, payload) {
    commit('REMOVE_FILE_SELECTED', payload);
    commit('RESET_SELECTED_FOLDER');
  },
  addFileSelected({commit}, payload) {
    commit('ADD_FILE_SELECTED', payload);
    commit('RESET_SELECTED_FOLDER');
  },
  addToClipboard({commit}) {
    commit('ADD_FILES_TO_CLIPBOARD');
  },
  removeFileInClipboard({commit}, payload) {
    commit('REMOVE_FILE_IN_CLIPBOARD', payload);
  },
  async moveFiles({state, dispatch, commit}) {
    let currentFolder = state.current
    let clipboard = state.clipboard
    let endpoint = this.$getEndpoint('move')
    commit('LOADING')
    let data = {
      files: clipboard.map(item => {
        return item.id
      }),
      dest: currentFolder.id ? currentFolder.id : null
    }

    let response = executeAxios(this.$axios, endpoint, data)

    await response.then(res => {
      if (res.data && res.data.message) {
        this.$snackbar(res.data.message, {
          color: 'success'
        })
      }
      dispatch('reload')
    }).catch(error => {
      let errMess = this.$trans('server_error')
      if (error.response && error.response.data && error.response.data.message) {
        errMess = error.response.data.message
      }
      this.$snackbar(errMess, {
        color: 'error'
      })
    })
    commit('RESET_CLIPBOARD');
  },
  async createFolder({dispatch, commit}, payload) {
    commit('LOADING')
    let endpoint = this.$getEndpoint('createFolder')
    let response = executeAxios(this.$axios, endpoint, payload)

    await response.then(res => {
      if (res.data && res.data.message) {
        this.$snackbar(res.data.message, {
          color: 'success'
        })
      }
      dispatch('reload')
    }).catch(error => {
      let errMess = this.$trans('server_error')
      if (error.response && error.response.data && error.response.data.message) {
        errMess = error.response.data.message
      }
      this.$snackbar(errMess, {
        color: 'error'
      })
    })
    commit('UNLOADING');
  },
  async deleteFolder({dispatch, commit}, payload) {
    commit('LOADING')
    let endpoint = this.$getEndpoint('deleteFolder', [payload])
    let response = executeAxios(this.$axios, endpoint, payload)

    await response.then(res => {
      if (res.data && res.data.message) {
        this.$snackbar(res.data.message, {
          color: 'success'
        })
      }
      dispatch('reload')
    }).catch(e => {
      let errMess = this.$trans('server_error')
      if (e.response && e.response.data && e.response.data.message) {
        errMess = e.response.data.message
      }
      this.$snackbar(errMess, {
        color: 'error'
      })
    });
    commit('UNLOADING');
  },
  async deleteSelected({dispatch, state, commit}) {
    commit('LOADING')
    let endpoint =  this.$getEndpoint('delete')
    let response = executeAxios(this.$axios, endpoint, {
      files: state.selectedFiles.map(item => {
        return item.id
      })
    })

    await response.then(res => {
      if (res.data && res.data.message) {
        this.$snackbar(res.data.message, {
          color: 'success'
        })
      }
      dispatch('reload')
    }).catch(e => {
      let errMess = this.$trans('server_error')
      if (e.response && e.response.data && e.response.data.message) {
        errMess = e.response.data.message
      }
      this.$snackbar(errMess, {
        color: 'error'
      })
    });
    commit('UNLOADING');
  },
  async editFolderName({dispatch, commit}, payload) {
    commit('LOADING')
    let endpoint = this.$getEndpoint('editFolder', [payload.id])
    let response = executeAxios(this.$axios, endpoint, payload)

    await response.then(res => {
      if (res.data && res.data.message) {
        this.$snackbar(res.data.message, {
          color: 'success'
        })
      }
      dispatch('reload')
    }).catch(e => {
      let errMess = this.$trans('server_error')
      if (e.response && e.response.data && e.response.data.message) {
        errMess = e.response.data.message
      }
      this.$snackbar(errMess, {
        color: 'error'
      })
    });
    commit('UNLOADING');
  },
  async editFile({commit, dispatch}, payload) {
    commit('LOADING')
    let endpoint = this.$getEndpoint('editFile', [payload.id])
    let response = executeAxios(this.$axios, endpoint, payload)

    await response.then(res => {
      if (res.data && res.data.message) {
        this.$snackbar(res.data.message, {
          color: 'success'
        })
      }
      dispatch('reload')
    }).catch(e => {
      let errMess = this.$trans('server_error')
      if (e.response && e.response.data && e.response.data.message) {
        errMess = e.response.data.message
      }
      this.$snackbar(errMess, {
        color: 'error'
      })
    });
    commit('UNLOADING');
  },
  openUploadModal({commit}) {
    commit('OPEN_UPLOAD_MODAL')
  },
  hideUploadModal({commit}) {
    commit('HIDE_UPLOAD_MODAL')
  },
  openFormModal({commit}, createForm) {
    commit('OPEN_FORM_MODAL', createForm)
  },
  hideFormModal({commit, dispatch}, reload) {
    commit('HIDE_FORM_MODAL')
    if (reload) {
      dispatch('reload')
    }
  },
  async search({commit}, payload) {
    commit('LOADING')
    commit('SEARCH', payload)
    let endpoint = this.$getEndpoint('search')
    let data = {
      ...{keyword: payload.keyword},
      ...payload.filter
    }
    let response = executeAxios(this.$axios, endpoint, data)

    await response.then(res => {
      commit('UPDATE_LIST', res.data)
      commit('RESET_SELECTED_FILES');
      commit('RESET_SELECTED_FOLDER');
    }).catch(error => {
      let errMess = this.$trans('server_error')
      if (error.response && error.response.data && error.response.data.message) {
        errMess = error.response.data.message
      }
      this.$snackbar(errMess, {
        color: 'error'
      })
      commit('RESET_SELECTED_FILES');
      commit('RESET_SELECTED_FOLDER');
    })
    commit('UNLOADING');
  },
  async getComments({state, commit}) {
    let fileSelected = state.selectedFiles[0]
    if (fileSelected && !fileSelected.commentsLoaded) {
      let endpoint = this.$getEndpoint('comments', [fileSelected.id])
      let response = executeAxios(this.$axios, endpoint)
      await response.then(res => {
        let payload = {
          comments: res.data,
          id: fileSelected.id
        }
        commit('LOAD_COMMENT', payload)
      }).catch(error => {
        let errMess = this.$trans('server_error')
        if (error.response && error.response.data && error.response.data.message) {
          errMess = error.response.data.message
        }
        this.$snackbar(errMess, {
          color: 'error'
        })
      })
    }
  },
  reload({state, dispatch}) {
    if (state.keyword !== '') {
      dispatch('search', {keyword: state.keyword, filter: state.filter})
    } else {
      dispatch('getByFolder', state.current)
    }
  }
}

function executeAxios(axios, endpoint, data) {
  let response
  if (endpoint.method.toUpperCase() === 'GET') {
    response = axios.get(endpoint.route, {
      params: data
    })
  } else {
    response = axios({
      method: endpoint.method,
      url: endpoint.route,
      data: data
    })
  }
  return response
}
