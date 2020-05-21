var data = require("../src/data/files");

module.exports = function(app) {
  app.route('/index')
    .get(function (req, res) {
      let folderId = req.query.folder_id
      let folder = data.getByFolder(folderId? parseInt(folderId) : false);
      res.json({
        data: folder,
        message: 'search success'
      })
    })

  app.route('/move')
    .post(function (req, res) {
      console.log(req)
      let folderId = req.body.dest
      let folder = data.getByFolder(folderId? parseInt(folderId) : false);
      res.json(folder)
    })
};
