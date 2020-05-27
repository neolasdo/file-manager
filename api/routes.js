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
      }, 2000)

    })

  app.route('/move')
    .post(function (req, res) {
      let folderId = req.body.dest
      let folder = data.getByFolder(folderId? parseInt(folderId) : false);
      res.json(folder)
    })
};
