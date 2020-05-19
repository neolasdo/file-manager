let express = require('express');
var bodyParser = require('body-parser')
let app = express();
let port = process.env.PORT || 8001;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

let routes = require('./routes')
routes(app)

app.listen(port);

console.log('RESTful API server started on: ' + port);
