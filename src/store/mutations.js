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
  UPDATE_LIST(state, payload) {
    state.files = payload.files
    state.folders = payload.children
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
    if (payload && payload.id) {
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
  }
}
