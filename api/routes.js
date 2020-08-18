var data = require("../src/data/files");

module.exports = function (app) {
  app.route('/index')
    .get(function (req, res) {
      let folderId = req.query.folder_id
      let folder = data.getByFolder(folderId ? parseInt(folderId) : false);
      setTimeout(function () {
        res.json({
          data: folder,
          message: 'search success'
        })
      }, 1000)

    })

  app.route('/file/:id/comments')
    .get(function (req, res) {
      let data = [];
      let page = parseInt(req.query.page ? req.query.page : 1)
      for (let i = 0; i <= 10; i++) {
        let comment = {
          message: 'test comment 00000' + (10 * (page - 1) + i),
          created_at: '2020/3/4 03:02',
          isMy: i % 2 === 1,
          author: {
            id: i % 2 === 1 ? 1 : 2,
            email: 'test@gmail.com'
          }
        }
        data.push(comment)
      }
      setTimeout(function () {
        res.json({
          data: {
            data: data,
            pagination: {
              base: "http://localhost/api/v1/file-manager/file/82/comments?page=1",
              current: page,
              last: 10,
              next: null,
              prev: null,
              size: 10,
              total: 2,
            }
          },
          message: 'search success'
        })
      }, 1000)

    })
  app.route('/file/:id/path')
    .get(function (req, res) {
      let params = req.params
      
      setTimeout(function () {
        res.json({
          data: 'https://romusystem-dev.s3.ap-northeast-1.amazonaws.com/5ec64c5c988f4/114/1596771883_file%20example%20XLSX%205000-%C4%91%C3%A3%20chuy%E1%BB%83n%20%C4%91%E1%BB%95i.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATXLDAZQUI2JUFZPE%2F20200818%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20200818T091939Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1800&X-Amz-Signature=a9b855aa175a5405f664b59e937cb2ad023718e10761148a1e1f58b7fdb49bcd',
          params: params,
          message: 'search success',
          success: true
        })
      }, 1000)

    })
  app.route('/move')
    .post(function (req, res) {
      let folderId = req.body.dest
      let folder = data.getByFolder(folderId ? parseInt(folderId) : false);
      res.json(folder)
    })

  app.route('/move')
    .post(function (req, res) {
      let folderId = req.body.dest
      let folder = data.getByFolder(folderId ? parseInt(folderId) : false);
      res.json(folder)
    })


  app.route('/request-approval')
    .post(function (req, res) {
      setTimeout(function () {
        res.json({
          message: 'upload success'
        })
      }, 7000)
    })

  app.route('/upload')
    .post(function (req, res) {
      setTimeout(function () {
        res.json({
          message: 'upload success'
        })
      }, 7000)
    })
};
