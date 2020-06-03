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
      }, 5000)
    })
};
