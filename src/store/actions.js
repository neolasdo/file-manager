import getByFolder from "../data/files";

export default {
  async getByFolder({ state, commit, rootState }, item) {
    console.log(state, commit, rootState)
    commit('LOADING')
    commit('UPDATE_BREADCRUMB', item);
    commit('UPDATE_CURRENT', item);
    let res = await getByFolder(item && item.id)
    commit('UPDATE_LIST', res)
    commit('UPDATE_CURRENT', res  )
    commit('RESET_SELECTED_FILES');
    commit('RESET_SELECTED_FOLDER');
    commit('UNLOADING');
  },
  selectFolder({ state, commit, rootState }, payload) {
    console.log(state, commit, rootState)
    commit('RESET_SELECTED_FILES');
    commit('SELECT_FOLDER', payload);
  },
  resetSelectedFiles({ state, commit, rootState }) {
    console.log(state, commit, rootState)
    commit('RESET_SELECTED_FILES');
  },
  removeFileSelected({ state, commit, rootState }, payload) {
    console.log(state, commit, rootState)
    commit('REMOVE_FILE_SELECTED', payload);
    commit('RESET_SELECTED_FOLDER');
  },
  addFileSelected({ state, commit, rootState }, payload) {
    console.log(state, commit, rootState)
    commit('ADD_FILE_SELECTED', payload);
    commit('RESET_SELECTED_FOLDER');
  },
  download({ state, commit, rootState }) {
    console.log(state, commit, rootState)
    commit('LOADING')
    console.log(state.selectedFiles);
    commit('RESET_SELECTED_FILES');
    commit('UNLOADING');
  },
  createFolder({ state, commit, rootState }, payload) {
    console.log(state, commit, rootState, payload)
    // @TODO: using axios to call create Folder api
  },
  deleteFolder({ state, commit, rootState }, payload) {
    console.log(state, commit, rootState, payload)
    // @TODO: using axios to call delete Folder api
  },
  deleteSelected({ state, commit, rootState }, payload) {
    console.log(state, commit, rootState, payload)
    // @TODO: using axios to call delete Folder api
  },
  editFolderName({ state, commit, rootState }, payload) {
    console.log(state, commit, rootState, payload)
    // @TODO: using axios to call edit Folder name api

  },
  editFile({ state, commit, rootState }, payload) {
    console.log(state, commit, rootState, payload)
// @TODO: using axios to call edit File name api

  },
  openUploadModal({ state, commit, rootState }) {
    console.log(state, commit, rootState)
    commit('OPEN_UPLOAD_MODAL')
  },
  hideUploadModal({ state, commit, rootState }) {
    console.log(state, commit, rootState)
    commit('HIDE_UPLOAD_MODAL')
  },
  openFormModal({ state, commit, rootState }, createForm) {
    console.log(state, commit, rootState)
    commit('OPEN_FORM_MODAL', createForm)
  },
  hideFormModal({ state, commit, rootState }) {
    console.log(state, commit, rootState)
    commit('HIDE_FORM_MODAL')
  }
}
