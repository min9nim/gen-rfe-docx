var express = require('express');
var app = express();
var genDocx = require('./gen-docx')
var download = require('./download')
var fs = require('fs');
var path = require('path');
const fetch = require('node-fetch');

app.use(express.json())
// app.use(express.static('public'));

app.post('/gen-docx', function (req, res) {
  console.log(req.body)
  const filename = genDocx(req.body)
  res.send({res: filename});
});

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../public/', 'index.html'));
});

app.get('/anony', function (req, res) {
  fetch('https://anony-react.appspot.com/api/posts/view/SylrTKOQCr', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
  })
  .then(response => response.json())
  .then(json => {
    console.log(json)
    res.send(json)
  })
});

app.get('/generated/*.docx', function (req, res){
  console.log(req.originalUrl)
  const mimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  const filename = req.originalUrl.split('/')[2]
  // var data = fs.readFileSync(path.resolve(path2, 'output.docx'), 'binary');
  console.log('read: ' + '/tmp/' + filename)
  var data = fs.readFileSync('/tmp/' + filename, 'binary');
  download(data, filename, mimetype, res)
})
// 서비스 포트
//console.log("process.env.PORT = " + process.env.PORT)
const PORT = process.env.PORT || 3000

app.listen(PORT, function () {
  console.log('Example app listening on port' + PORT);
});
