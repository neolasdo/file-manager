import optionsDefaults from "./defaultOpts";
import FileManager from "../components/FileManager";

import store from "../store/store";

export default {
  install(Vue, opts) {
    const options = {...optionsDefaults, ...opts}
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }
    if (!options.endpoints ||
      !options.endpoints.get ||
      !options.endpoints.search ||
      !options.endpoints.download ||
      !options.endpoints.createFolder ||
      !options.endpoints.upload ||
      !options.endpoints.delete ||
      !options.endpoints.editFolder ||
      !options.endpoints.editFile ||
      !options.endpoints.deleteFolder
    ) {
      throw new Error('Please initialise plugin with endpoints list (get, search, download, createFolder, upload, delete, editFolder, editFile, deleteFolder).')
    }
    store.$axios = options.axios
    store.$endpoints = options.endpoints
    Vue.prototype.$fileStore = store;
    Vue.component('file-manager', FileManager)
  }
}
