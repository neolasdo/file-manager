export default {
  OPEN_UPLOAD_MODAL(state) {
    state.showUploadModal = true
  },
  HIDE_UPLOAD_MODAL(state) {
    state.showUploadModal = false
  },
  OPEN_FORM_MODAL(state, createForm) {
    if (createForm) {
      state.formCreate = createForm
    } else {
      state.formCreate = false
    }
    state.showFormModal = true
  },
  HIDE_FORM_MODAL(state) {
    state.showFormModal = false
  },
  SELECT_FOLDER(state, payload) {
    state.selectedFolder = payload
  },
  RESET_SELECTED_FOLDER(state) {
    state.selectedFolder = {}
  },
  RESET_SELECTED_FILES(state) {
    state.selectedFiles = []
  },
  REMOVE_FILE_SELECTED(state, payload) {
    state.selectedFiles.splice(payload, 1);
  },
  ADD_FILE_SELECTED(state, payload) {
    state.selectedFiles.push(payload)
  },
  LOADING(state) {
    state.isLoading = true;
  },
  UNLOADING(state) {
    state.isLoading = false;
  },
  LOADED(state) {
    state.loaded = true;
  },
  UPDATE_LIST(state, payload) {
    state.files = payload.files ? payload.files: state.files
    state.folders = payload.children ? payload.children: state.folders
    function sort(a, b) {
      if (a[state.sortKey] && b[state.sortKey]) {
        let keyA = a[state.sortKey].toLowerCase()
        let keyB = b[state.sortKey].toLowerCase()
        if (state.sortType.toUpperCase() === 'ASC') {
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        } else {
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        }
      }
    }
    if (state.sortType && state.sortKey) {
      state.files = state.files.sort((a,b) => sort(a, b))
      state.folders = state.folders.sort((a,b) => sort(a, b))
    }
  },
  UPDATE_SORT(state, payload) {
    state.sortKey = payload.sortKey
    state.sortType = payload.sortType ? payload.sortType.toUpperCase() : 'ASC'
  },
  UPDATE_CURRENT(state, payload) {
    if (payload && payload.id) {
      state.current = payload
    } else {
      state.current = {};
    }
  },
  UPDATE_BREADCRUMB(state, payload) {
    if (payload && payload.breadcrumb) {
      state.breadcrumb = payload.breadcrumb
    } else if (payload && payload.id) {
      let index = state.breadcrumb.findIndex(item => {
        return item.id === payload.id
      })
      if (index !== -1) {
        state.breadcrumb.splice(index + 1)
      } else {
        state.breadcrumb.push({
          text: payload.name,
          id: payload.id
        })
      }
    } else {
      state.breadcrumb = [
        {
          text: 'Home',
          id: ''
        }
      ]
    }
  },
  SEARCH(state, payload) {
    state.keyword = payload.keyword
    state.filter = payload.filter
    state.isSearching = true
  },
  RESET_SEARCH(state) {
    state.isSearching = false
    state.keyword = ''
    state.filter = {}
  },
  LOAD_COMMENT(state, payload) {
    state.comments = Array.isArray(payload.data) ? payload.data.reverse() : []
    state.itemComment = state.selectedFiles[0] ? state.selectedFiles[0].id: undefined
    state.commentPaginate = payload.pagination
  },
  ADD_COMMENTS(state, payload) {
    state.comments = [...(Array.isArray(payload.data) ? payload.data.reverse() : []), ...(state.comments)]
    state.itemComment = state.selectedFiles[0] ? state.selectedFiles[0].id: undefined
    state.commentPaginate = payload.pagination
  },
  RESET_COMMENT_LIST(state) {
    state.comments = []
    state.itemComment = undefined
    state.commentPaginate = {}
  },
  SHOW_MAIN_CONTEXT(state, payload) {
    state.showMainContext = true
    state.showFolderContext = false
    state.showFileContext = false
    state.pointerEvent = payload
  },
  SHOW_FILE_CONTEXT(state, payload) {
    state.showMainContext = false
    state.showFolderContext = false
    state.showFileContext = true
    state.pointerEvent = payload
  },
  SHOW_FOLDER_CONTEXT(state, payload) {
    state.showMainContext = false
    state.showFolderContext = true
    state.showFileContext = false
    state.pointerEvent = payload
  },
  HIDE_CONTEXT(state) {
    state.showMainContext = false
    state.showFolderContext = false
    state.showFileContext = false
  },
  HIDE_REQUEST_MODAL(state) {
    state.showRequestModal = false
  },
  SHOW_REQUEST_MODAL(state, payload) {
    if (payload) {
      state.requestingType = payload
    } else {
      state.requestingType = 'sign'
    }
    state.showRequestModal = true
  },
  RESET_STATE(state) {
    Object.assign(state, {
      files: [],
      loaded: false,
      isSearching: false,
      keyword: '',
      sortKey: '',
      sortType: '',
      filter: {},
      folders: [],
      current: {},
      selectedFiles: [],
      selectedFolder: {},
      breadcrumb: [
        {
          text: '',
          id: ''
        }
      ],
      comments: [],
      commentPaginate: {},
      itemComment: undefined,
      showUploadModal: false,
      showFormModal: false,
      formCreate: false,
      isLoading: false,
      showMainContext: false,
      showFolderContext: false,
      showFileContext: false,
      pointerEvent: {
        x: 0,
        y: 0
      }
    })
  },
  ADD_FILES_REQUEST(state, payload) {
    let type = state.requestingType
    state.requestFiles[type] = [...(state.requestFiles[type]), ...payload]
  },
  ADD_SIGN_FILES_REQUEST(state, payload) {
    let type = 'sign'
    payload.forEach((item) => {
      let existIdx = state.requestFiles[type].findIndex((file) => {
        return file.id == item.id
      })
      if (existIdx !== -1) {
        state.requestFiles[type][existIdx] = item
      } else {
        state.requestFiles[type].push(item)
      }
    })
  },
  ADD_APPROVAL_FILES_REQUEST(state, payload) {
    let type = 'approval'
    payload.forEach((item) => {
      let existIdx = state.requestFiles[type].findIndex((file) => {
        return file.id == item.id
      })
      if (existIdx !== -1) {
        state.requestFiles[type][existIdx] = item
      } else {
        state.requestFiles[type].push(item)
      }
    })
  },
  REMOVE_FILES_REQUEST(state, index) {
    let type = state.requestingType
    state.requestFiles[type].splice(index, 1)
  },
  RESET_REQUEST_FILES(state) {
    let type = state.requestingType
    state.requestFiles[type] = []
  },
  ON_DELETE_FOLDER(state, folderId) {
    for (const [key, value] of Object.entries(state.requestFiles)) {
      state.requestFiles[key] = value.filter((item) => {
        return item.folder_id != folderId
      })
    }
  },
  ON_DELETE_FILES(state, fileIds) {
    for (const [key, value] of Object.entries(state.requestFiles)) {
      state.requestFiles[key] = value.filter((item) => {
        return item.id != fileIds
      })
    }
  },
  ON_UPDATE_FILE_NAME(state, payload) {
    for (const [key, value] of Object.entries(state.requestFiles)) {
      state.requestFiles[key] = value.map((item) => {
        if (item.id === payload.id) {
          item.name = payload.name
        }
        return item
      })
    }
  }
}
