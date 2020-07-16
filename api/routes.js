var data = require("../src/data/files");

module.exports = function(app) {
  app.route('/index')
    .get(function (req, res) {
      let folderId = req.query.folder_id
      let folder = data.getByFolder(folderId? parseInt(folderId) : false);
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
      for (let i=0; i<=10; i++) {
        let comment = {
          message: 'test comment 00000'+(10 * (page-1) +i),
          created_at: '2020/3/4 03:02',
          isMy: i%2===1,
          author: {
            id: i%2===1? 1: 2,
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

  app.route('/move')
    .post(function (req, res) {
      let folderId = req.body.dest
      let folder = data.getByFolder(folderId? parseInt(folderId) : false);
      res.json(folder)
    })

  app.route('/request-sign')
    .post(function (req, res) {
      res.json({status: true})
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
