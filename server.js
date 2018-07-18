// $ node server.js <dir_root> <url_root> <port>

var bodyParser = require('body-parser');
var childProcess = require('child_process');
var fs = require('fs');
var express = require('express');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var dir_root = process.argv[2]
var url_root = process.argv[3]
var port = process.argv[4]
const exec = childProcess.exec;

// WEB SERVER
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.listen(port);
console.log('Listening port is ' + port);

app.post('/g2g/', function(req, res){
  var date = new Date();
  var id = date.getTime();
  var dir_out = dir_root + '/tmp/' + id;
  var url_out = url_root + '/tmp/' + id;
  console.log("A request is received (ID: " + id + ")");
  mkdirp(dir_out, function(err) {
    if (err) { console.log(err); };
    var rdf_file = dir_out + '/tmp.ttl';
    var g2g_file = dir_out + '/tmp.g2g';
    var dot_file = dir_out + '/tmp.dot';
    var png_file = dir_out + '/tmp.png';
    fs.writeFile(rdf_file, req.body.rdf, function (err) {
      if (err) { console.log(err); };
      fs.writeFile(g2g_file, req.body.g2g, function (err) {
        if (err) { console.log(err); };
        var cmd = 'g2g -f all ' + g2g_file + ' ' + rdf_file + ' -o ' + dir_out;
        console.log(cmd);
        exec(cmd, (err, stdout, stderr) => {
          if (err) { pg_data = err; };
          var cmd_dot = 'dot -Tpng < ' + dot_file + ' > ' + png_file;
          exec(cmd_dot, (err, stdout, stderr) => {
            if (err) { console.log(err); };
            var body = { dir_out: url_out };
            returnResult(res, body);
          });
        });
      });
    });
  });
});

var returnResult = function(res, body) {
  res.set('Content-Type', 'application/json');
  res.json(body);
};

