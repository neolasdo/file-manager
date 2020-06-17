let all = {
  name: 'Home',
  id: '',
  children: [
    {
      name: 'Dir 1',
      id: 1,
      children: [
        {
          name: 'Dir 2',
          id: 2,
          children: [
            {
              name: 'Dir 3',
              id: 3,
              children: [],
              files: []
            },
          ],
          files: [
            {
              name: 'File 5',
              id: 5,
              path: 'https://file-examples.com/wp-content/uploads/2017/02/file-sample_500kB.docx',
              mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              size: 125133,
              created_at: '2019-01-01',
              label: 'Requesting',
              labelColor: 'primary'
            },
            {
              name: 'File 6',
              id: 6,
              path: 'https://file-examples.com/wp-content/uploads/2017/02/file-sample_1MB.docx',
              mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              size: 12512344,
              created_at: '2019-01-01'
            },
            {
              name: 'File 7',
              id: 7,
              path: 'https://file-examples.com/wp-content/uploads/2017/02/file_example_XLS_1000.xls',
              mime: 'application/vnd.ms-excel',
              size: 1211111,
              created_at: '2019-01-01'
            },
            {
              name: 'File 8',
              id: 8,
              path: 'https://file-examples.com/wp-content/uploads/2017/02/file_example_XLSX_1000.xlsx',
              mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              size: 125123112,
              created_at: '2019-01-01'
            },
          ]
        }
      ],
    },
    {
      name: 'Dir 4',
      id: 4,
      children: [
        {
          name: 'Dir 5',
          id: 5,
          children: [
            {
              name: 'Dir 6',
              id: 6,
              children: [],
              files: [
                {
                  name: 'File 9',
                  id: 9,
                  path: 'https://file-examples.com/wp-content/uploads/2017/02/file_example_XLSX_1000.xlsx',
                  mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  size: 1251111,
                  created_at: '2019-01-01'
                },
                {
                  name: 'File 10',
                  id: 10,
                  path: 'https://file-examples.com/wp-content/uploads/2017/10/file-example_PDF_500_kB.pdf',
                  mime: 'application/pdf',
                  size: 2512223,
                  created_at: '2019-01-01'
                },
                {
                  name: 'File 11',
                  id: 11,
                  path: 'https://file-examples.com/wp-content/uploads/2017/08/file_example_PPT_250kB.ppt',
                  mime: 'application/vnd.ms-powerpoint',
                  size: 12512312,
                  created_at: '2019-01-01'
                },
                {
                  name: 'File 12',
                  id: 12,
                  path: 'https://file-examples.com/wp-content/uploads/2017/08/file_example_PPT_1MB.ppt',
                  mime: 'application/vnd.ms-powerpoint',
                  size: 1251231,
                  created_at: '2019-01-01'
                },
              ]
            },
            {
              name: 'Dir 7',
              id: 7,
              children: [],
              documents: []
            },
          ],
          files: [
            {
              name: 'File 13',
              is_official: false,
              id: 13,
              isDir: false,
              path: 'https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_1MB.jpg',
              mime: 'image/jpeg',
              size: 125133,
              created_at: '2019-01-01',
              label: 'Requesting',
            },
            {
              name: 'File 14',
              is_official: true,
              id: 14,
              isDir: false,
              path: 'https://file-examples.com/wp-content/uploads/2017/10/file_example_PNG_1MB.png',
              mime: 'image/png',
              size: 12512344,
              created_at: '2019-01-01'
            },
            {
              name: 'File 15',
              id: 15,
              isDir: false,
              path: 'https://file-examples.com/wp-content/uploads/2017/10/file_example_GIF_1MB.gif',
              mime: 'image/gif',
              size: 1211111,
              created_at: '2019-01-01'
            },
            {
              name: 'File 16',
              id: 16,
              isDir: false,
              path: 'https://file-examples.com/wp-content/uploads/2017/10/file_example_favicon.ico',
              mime: 'image/gif',
              size: 125123112,
              created_at: '2019-01-01'
            },{
              name: 'File 17',
              id: 17,
              isDir: false,
              path: 'http://localhost/file13',
              mime: 'application/pdf',
              size: 125133,
              created_at: '2019-01-01'
            },
            {
              name: 'File 18',
              id: 18,
              isDir: false,
              path: 'http://localhost/file14',
              mime: 'application/pdf',
              size: 12512344,
              created_at: '2019-01-01'
            },
            {
              name: 'File 19',
              id: 19,
              isDir: false,
              path: 'http://localhost/file15',
              mime: 'application/pdf',
              size: 1211111,
              created_at: '2019-01-01'
            },
            {
              name: 'File 20',
              id: 20,
              isDir: false,
              path: 'http://localhost/file16',
              mime: 'application/pdf',
              size: 125123112,
              created_at: '2019-01-01'
            },
            {
              name: 'File 21',
              id: 21,
              isDir: false,
              path: 'http://localhost/file13',
              mime: 'application/pdf',
              size: 125133,
              created_at: '2019-01-01'
            },
            {
              name: 'File 22',
              id: 22,
              isDir: false,
              path: 'http://localhost/file14',
              mime: 'application/pdf',
              size: 12512344,
              created_at: '2019-01-01'
            },
            {
              name: 'File 23',
              id: 23,
              isDir: false,
              path: 'http://localhost/file15',
              mime: 'application/pdf',
              size: 1211111,
              created_at: '2019-01-01'
            },
            {
              name: 'File 24',
              id: 24,
              isDir: false,
              path: 'http://localhost/file16',
              mime: 'application/pdf',
              size: 125123112,
              created_at: '2019-01-01'
            },{
              name: 'File 25',
              id: 25,
              isDir: false,
              path: 'http://localhost/file13',
              mime: 'application/pdf',
              size: 125133,
              created_at: '2019-01-01'
            },
            {
              name: 'File 26',
              id: 26,
              isDir: false,
              path: 'http://localhost/file14',
              mime: 'application/pdf',
              size: 12512344,
              created_at: '2019-01-01'
            },
            {
              name: 'File 27',
              id: 27,
              isDir: false,
              path: 'http://localhost/file15',
              mime: 'application/pdf',
              size: 1211111,
              created_at: '2019-01-01'
            },
            {
              name: 'File 28',
              id: 28,
              isDir: false,
              path: 'http://localhost/file16',
              mime: 'application/pdf',
              size: 125123112,
              created_at: '2019-01-01'
            },
          ]
        }
      ],
    },
  ],
  files: []
}
let emptyFolder = {
  name: 'Dir 4',
  id: 4,
  isDir: true,
  children: [],
  files: []
}

module.exports = {
  all: all,
  findById: function (folder, id) {
    let res = false;
    for (let item of folder.children) {
      if (item.id === id) {
        return item;
      } else {
        if (item.children.length) {
          res = this.findById(item, id);
          if (res) {
            return res;
          }
        }
      }
    }
    return false;
  },
  getByFolder: function(id) {
    if (!id) {
      return this.all;
    } else {
      let result = this.findById(this.all, id);
      return result ? result : emptyFolder ;
    }
  }
}
