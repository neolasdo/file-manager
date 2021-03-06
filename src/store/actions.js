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
      commit('RESET_COMMENT_LIST')
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
      commit('UNLOADING');

      if (!state.loaded) {
        commit('LOADED')
      }
    }).catch(error => {
      getErrorMessage(error,this.$snackbar, this.$trans)
      commit('UPDATE_BREADCRUMB', item);
      commit('RESET_SEARCH');
      commit('RESET_COMMENT_LIST');
      commit('RESET_SELECTED_FILES');
      commit('RESET_SELECTED_FOLDER');
      commit('UNLOADING');
      if (!state.loaded) {
        commit('LOADED')
      }
    })
  },
  loading({commit}) {
    commit('LOADING')
  },
  unloading({commit}) {
    commit('UNLOADING')
  },
  selectFolder({commit}, payload) {
    commit('RESET_SELECTED_FILES');
    commit('RESET_COMMENT_LIST');
    commit('SELECT_FOLDER', payload);
  },
  resetSelectedFiles({commit}) {
    commit('RESET_SELECTED_FILES');
    commit('RESET_COMMENT_LIST');
  },
  removeFileSelected({commit}, payload) {
    commit('REMOVE_FILE_SELECTED', payload);
    commit('RESET_COMMENT_LIST', payload);
    commit('RESET_SELECTED_FOLDER');
  },
  addFileSelected({commit}, payload) {
    commit('ADD_FILE_SELECTED', payload);
    commit('RESET_COMMENT_LIST', payload);
    commit('RESET_SELECTED_FOLDER');
  },
  async moveFiles({dispatch, commit}, payload) {
    commit('RESET_COMMENT_LIST');
    let dest = payload.id
    let files = payload.files
    let folders = payload.folder ? [payload.folder] : []
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
  },
  async deleteFolder({dispatch, commit}, payload) {
    commit('RESET_COMMENT_LIST');
    commit('LOADING')
    let endpoint = this.$getEndpoint('deleteFolder', [payload])
    let response = executeAxios(this.$axios, endpoint, payload)
    await response.then(res => {
      commit('ON_DELETE_FOLDER', payload)
      getMessage(res,this.$snackbar)
      dispatch('reload')
    }).catch(error => {
      getErrorMessage(error,this.$snackbar, this.$trans)
    });
    commit('UNLOADING');
  },
  async deleteSelected({dispatch, state, commit}) {
    commit('RESET_COMMENT_LIST');
    commit('LOADING')
    let files = state.selectedFiles.map(item => {
      return item.id
    })
    let endpoint =  this.$getEndpoint('delete')
    let response = executeAxios(this.$axios, endpoint, {
      files: files
    })

    await response.then(res => {
      commit('ON_DELETE_FILES', files)
      getMessage(res,this.$snackbar)
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
    commit('RESET_COMMENT_LIST');
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
      commit('UNLOADING');
    }).catch(error => {
      getErrorMessage(error,this.$snackbar, this.$trans)
      commit('RESET_SELECTED_FILES');
      commit('RESET_SELECTED_FOLDER');
      commit('UNLOADING');
    })
  },
  async getComments({state, commit}) {
    let data = {}
    let fileSelected = state.selectedFiles[0]
    commit('RESET_COMMENT_LIST')
    commit('LOADING')
    let endpoint = this.$getEndpoint('comments', [fileSelected.id])
    let response = executeAxios(this.$axios, endpoint, data)
    await response.then(res => {
      commit('UNLOADING')
      commit('LOAD_COMMENT', res.data.data)
    }).catch(error => {
      commit('UNLOADING')
      getErrorMessage(error,this.$snackbar, this.$trans)
    })
  },
  async loadMoreComments({state, commit}) {
    let commentPaginate = state.commentPaginate
    let fileSelected = state.selectedFiles[0]
    if (commentPaginate.current < commentPaginate.last) {
      let endpoint = this.$getEndpoint('comments', [fileSelected.id])
      let response = executeAxios(this.$axios, endpoint, {
        page:  commentPaginate.current ? commentPaginate.current + 1: 1
      })
      commit('LOADING')
      await response.then(res => {
        commit('UNLOADING')
        commit('ADD_COMMENTS', res.data.data)
      }).catch(error => {
        commit('UNLOADING')
        getErrorMessage(error,this.$snackbar, this.$trans)
      })
    }
  },
  async addComment({state, commit, dispatch}, payload) {
    let fileSelected = state.selectedFiles[0]
    if (fileSelected) {
      commit('LOADING')
      let endpoint = this.$getEndpoint('addComment', [fileSelected.id])
      let response = executeAxios(this.$axios, endpoint, {message: payload})
      await response.then(res => {
        getMessage(res, this.$snackbar)
        dispatch('getComments')
        commit('UNLOADING')
      }).catch(error => {
        commit('UNLOADING')
        getErrorMessage(error,this.$snackbar, this.$trans)
      })
    }
  },
  hideRequestModal({commit}) {
    commit('HIDE_REQUEST_MODAL')
  },
  showRequestModal({commit}, payload) {
    commit('SHOW_REQUEST_MODAL', payload)
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
  async requestSign({commit, dispatch}, payload) {
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
        dispatch('reload')
        dispatch('resetRequestFiles')
        dispatch('hideRequestModal')
        getMessage(res,this.$snackbar)
      }).catch(error => {
        getErrorMessage(error,this.$snackbar, this.$trans)
      });
      commit('UNLOADING');
    }
  },
  async requestApproval({commit, dispatch}, payload) {
    if (payload.length) {
      commit('LOADING')
      let endpoint = this.$getEndpoint('request_approval')
      let data = {
        files: payload.map(item => {
          return item.id
        }),
      }
      let response = executeAxios(this.$axios, endpoint, data)
      await response.then(res => {
        dispatch('reload')
        dispatch('resetRequestFiles')
        dispatch('hideRequestModal')
        getMessage(res,this.$snackbar)
      }).catch(error => {
        getErrorMessage(error,this.$snackbar, this.$trans)
      });
      commit('UNLOADING');
    }
  },
  showMainContextMenu({commit, dispatch}, payload) {
    commit('SHOW_MAIN_CONTEXT', payload)
    dispatch('resetSelectedFiles')
  },
  showFileContextMenu({commit}, payload) {
    commit('SHOW_FILE_CONTEXT', payload)
  },
  showFolderContextMenu({commit}, payload) {
    commit('SHOW_FOLDER_CONTEXT', payload)
  },
  hideContext({commit}) {
    commit('HIDE_CONTEXT')
  },
  resetState({commit}) {
    commit('RESET_STATE')
  },
  addFilesRequest({commit}, payload) {
    commit('ADD_FILES_REQUEST', payload)
  },
  addSignFilesRequest({commit}, payload) {
    commit('ADD_SIGN_FILES_REQUEST', payload)
  },
  addApprovalFilesRequest({commit}, payload) {
    commit('ADD_APPROVAL_FILES_REQUEST', payload)
  },
  removeFileRequest({commit}, index) {
    commit('REMOVE_FILES_REQUEST', index)
  },
  resetRequestFiles({commit}) {
    commit('RESET_REQUEST_FILES')
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
