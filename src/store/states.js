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
  clipboard: {
    files: [],
    folders: []
  },
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
  },
  showRequestApprovalModal: false,
  showRequestSignModal: false,
  requestSignFiles: [],
  requestApprovalFiles: [],
  advisors: [],
  clearClipboard: false
}
