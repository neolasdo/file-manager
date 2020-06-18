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
      for (let i=0; i<=100; i++) {
        let comment = {
          comment: 'test comment 1212121212',
          created_at: '2020/3/4',
          author: {
            id: i%2===1? 1: 2,
            email: 'test@gmail.com'
          }
        }
        data.push(comment)
      }
      setTimeout(function () {
        res.json({
          data: data,
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

  app.route('/move')
    .post(function (req, res) {
      let folderId = req.body.dest
      let folder = data.getByFolder(folderId? parseInt(folderId) : false);
      res.json(folder)
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
