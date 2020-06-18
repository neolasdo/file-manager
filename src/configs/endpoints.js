export default {
  get: {
    route: 'index',
    method: 'get'
  },
  search: {
    route: 'search',
    method: 'get'
  },
  download: {
    route: 'download',
    method: 'post'
  },
  createFolder: {
    route: 'folder/create',
    method: 'post'
  },
  upload: {
    route: 'upload',
    method: 'post'
  },
  delete: {
    route: 'delete',
    method: 'delete'
  },
  editFolder: {
    route: 'folder/:id/edit',
    method: 'put'
  },
  editFile: {
    route: 'file/:id/edit',
    method: 'put'
  },
  deleteFolder: {
    route: 'folder/:id/delete',
    method: 'delete'
  },
  move: {
    route: 'move',
    method: 'post'
  },
  comments: {
    route: 'file/:id/comments',
    method: 'get'
  },
  addComment: {
    route: 'file/:id/comments',
    method: 'post'
  },
  request_approval: {
    route: 'request-approval',
    method: 'POST'
  },
  request_sign: {
    route: 'request-sign',
    method: 'POST'
  }
}
