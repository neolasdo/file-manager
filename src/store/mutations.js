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
  ADD_FILES_TO_CLIPBOARD(state) {
    state.clipboard.files = Array.from(new Set([...state.clipboard.files, ...state.selectedFiles]))
  },
  ADD_FOLDERS_TO_CLIPBOARD(state) {
    if (state.selectedFolder.id) {
      let index = state.clipboard.folders.findIndex(item => {
        return item.id === state.selectedFolder.id
      })
      if (index === -1) {
        state.clipboard.folders.push(state.selectedFolder)
        state.selectedFolder = {}
      }
    }
  },
  REMOVE_FILE_IN_CLIPBOARD(state, payload) {
    state.clipboard.files.splice(payload, 1);
  },
  REMOVE_FOLDER_IN_CLIPBOARD(state, payload) {
    state.clipboard.folders.splice(payload, 1);
  },
  RESET_CLIPBOARD(state) {
    state.clipboard =  {
      files: [],
      folders: []
    };
  },
  LOADING(state) {
    state.isLoading = true;
  },
  UNLOADING(state) {
    state.isLoading = false;
  },
  UPDATE_LIST(state, payload) {
    state.files = payload.files ? payload.files: []
    state.folders = payload.children ? payload.children: []
  },
  UPDATE_CURRENT(state, payload) {
    if (payload && payload.id) {
      state.current.id = payload.id
      state.current.name = payload.name
    } else {
      state.current = {
        name: '',
        id: ''
      };
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
    let index = state.files.findIndex(item => {
      return item.id === payload.id
    })
    if (index !== -1) {
      state.files[index].commentsLoaded = true
      state.files[index].comments = payload.comments
      state.selectedFiles[0] = state.files[index]
    }
  }
}
