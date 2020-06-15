export default {
  async getByFolder({commit, state, dispatch}, item) {
    let getEndpoint = this.$getEndpoint('get')
    commit('LOADING')
    commit('UPDATE_CURRENT', item);
    let data = {}
    if (item && item.id) {
      data.folder_id = item.id
    }
    let response = executeAxios(this.$axios, getEndpoint, data)

    await response.then(res => {
      let selectedFiles = state.selectedFiles
      let selectedFolder = state.selectedFolder
      commit('UPDATE_LIST', res.data.data)
      commit('UPDATE_CURRENT', res.data.data)
      commit('UPDATE_BREADCRUMB', res.data.data.breadcrumb ? res.data.data: item);
      commit('RESET_SEARCH');

      commit('RESET_SELECTED_FILES');
      commit('RESET_SELECTED_FOLDER');

      state.files.forEach(item => {
        if (selectedFiles.findIndex(selected => {return selected.id === item.id}) !== -1) {
          dispatch('addFileSelected', item)
        }
      })
      state.folders.forEach(item => {
        if (selectedFolder.id && item.id === selectedFolder.id) {
          dispatch('selectFolder', item)
        }
      })

    }).catch(error => {
      getErrorMessage(error,this.$snackbar, this.$trans)
      commit('UPDATE_BREADCRUMB', item);
      commit('RESET_SEARCH');
      commit('RESET_SELECTED_FILES');
      commit('RESET_SELECTED_FOLDER');
    })
    commit('UNLOADING');
  },
  loading({commit}) {
    commit('LOADING')
  },
  unloading({commit}) {
    commit('UNLOADING')
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
  addFilesToClipboard({commit}) {
    commit('ADD_FILES_TO_CLIPBOARD');
  },
  addFolderToClipboard({commit}) {
    commit('ADD_FOLDERS_TO_CLIPBOARD');
  },
  removeFileInClipboard({commit}, payload) {
    commit('REMOVE_FILE_IN_CLIPBOARD', payload);
  },
  removeFolderInClipboard({commit}, payload) {
    commit('REMOVE_FOLDER_IN_CLIPBOARD', payload);
  },
  async moveFiles({state, dispatch, commit}, payload) {
    let dest = state.current.id
    let clipboard = state.clipboard
    let files = clipboard.files
    let folders = clipboard.folders
    let resetClipBoard = true
    if (payload) {
      resetClipBoard = false
      dest = payload.id
      files = payload.files
      folders = payload.folder ? [payload.folder] : []
    }
    let endpoint = this.$getEndpoint('move')
    commit('LOADING')
    let data = {
      files: files.map(item => {
        return item.id
      }),
      folders: folders.map(item => {
        return item.id
      }),
      dest: dest ? dest : null
    }

    let response = executeAxios(this.$axios, endpoint, data)

    await response.then(res => {
      getMessage(res,this.$snackbar)

      dispatch('reload')
    }).catch(error => {
      getErrorMessage(error,this.$snackbar, this.$trans)
    })
    if (resetClipBoard) {
      commit('RESET_CLIPBOARD');
    }
  },
  async deleteFolder({dispatch, state, commit}, payload) {
    commit('LOADING')
    let endpoint = this.$getEndpoint('deleteFolder', [payload])
    let response = executeAxios(this.$axios, endpoint, payload)
    await response.then(res => {
      getMessage(res,this.$snackbar)
      let index = state.clipboard.folders.findIndex(folder => {
        return folder.id === payload
      })
      if (index !== -1) {
        dispatch('removeFolderInClipboard', index)
      }
      dispatch('reload')
    }).catch(error => {
      getErrorMessage(error,this.$snackbar, this.$trans)
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
      getMessage(res,this.$snackbar)
      state.selectedFiles.forEach(item => {
        let index = state.clipboard.files.findIndex(file => {
          return file.id === item.id
        })
        if (index !== -1) {
          dispatch('removeFileInClipboard', index)
        }
      })
      dispatch('reload')
    }).catch(error => {
      getErrorMessage(error,this.$snackbar, this.$trans)
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
      getMessage(res,this.$snackbar)
      commit('UPDATE_LIST', res.data.data)
      commit('RESET_SELECTED_FILES');
      commit('RESET_SELECTED_FOLDER');
    }).catch(error => {
      getErrorMessage(error,this.$snackbar, this.$trans)
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
        getMessage(res,this.$snackbar)
        let payload = {
          comments: res.data,
          id: fileSelected.id
        }
        commit('LOAD_COMMENT', payload)
      }).catch(error => {
        getErrorMessage(error,this.$snackbar, this.$trans)
      })
    }
  },
  reload({state, dispatch}) {
    if (state.keyword !== '') {
      dispatch('search', {keyword: state.keyword, filter: state.filter})
    } else {
      dispatch('getByFolder', state.current)
    }
  },
  changeSort({commit}, payload) {
    commit('UPDATE_SORT', payload)
    commit('UPDATE_LIST', payload)
  },
  async requestSign({commit}, payload) {
    if (payload.length) {
      commit('LOADING')
      let endpoint = this.$getEndpoint('request_sign')
      let data = {
        files: payload.map(item => {
          return item.id
        }),
      }
      let response = executeAxios(this.$axios, endpoint, data)
      await response.then(res => {
        getMessage(res,this.$snackbar)
      }).catch(error => {
        getErrorMessage(error,this.$snackbar, this.$trans)
      });
      commit('UNLOADING');
    }
  },
  resetClipboard({commit}) {
    commit('RESET_CLIPBOARD');
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

function getErrorMessage(error, snackbar, trans) {
  let errMess = trans('server_error')
  if (error.response && error.response.data && error.response.data.message) {
    errMess = error.response.data.message
  }
  if (error.data && error.data.message) {
    errMess = error.data.message
  }
  snackbar(errMess, {
    color: 'error'
  })
}

function getMessage(res, snackbar) {
  if (res.data && res.data.message) {
    snackbar(res.data.message, {
      color: 'success'
    })
  }
}
