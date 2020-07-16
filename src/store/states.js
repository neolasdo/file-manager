export default {
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
  showRequestModal: false,
  requestingType: 'sign',
  pointerEvent: {
    x: 0,
    y: 0
  }
}
