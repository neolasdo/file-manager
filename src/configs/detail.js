import {formatSize} from "../helpers/file";

export default {
  fileDetail: [
    {
      key: 'id',
      label: 'File id'
    },
    {
      key: 'name',
      label: 'File name'
    },
    {
      key: 'mime',
      label: 'File mime'
    },
    {
      key: 'size',
      label: 'File size',
      formatFunc: function (val) {
        return formatSize(val)
      }
    },
    {
      key: 'created_at',
      label: 'File Created date'
    },
  ],
  folderDetail: [
    {
      key: 'id',
      label: 'Folder id'
    },
    {
      key: 'name',
      label: 'Folder name'
    },
  ],
}
