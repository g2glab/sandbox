
var bodyParser = require('body-parser');
var childProcess = require('child_process');
var fs = require('fs');
var express = require('express');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var port=8080;
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
  console.log("A request is received (ID: " + id + ")");
  mkdirp('./tmp/' + id, function(err) {
    if (err) { console.log(err); };
    var rdf_file = './tmp/' + id + '/tmp.ttl';
    var g2g_file = './tmp/' + id + '/tmp.g2g';
    var pg_file  = './tmp/' + id + '/tmp.pg';
    fs.writeFile(rdf_file, req.body.rdf, function (err) {
      if (err) { console.log(err); };
      fs.writeFile(g2g_file, req.body.g2g, function (err) {
        if (err) { console.log(err); };
        var cmd = 'g2g dot ' + g2g_file + ' ' + rdf_file + ' ./tmp/' + id;
        exec(cmd, (err, stdout, stderr) => {
          if (err) { pg_data = err; };
          mkdirp('/var/www/html/tmp/' + id, function(err) {
            var cmd_dot = 'dot -Tpng < ./tmp/' + id + '/tmp.dot > /var/www/html/tmp/' + id + '/tmp.png';
            exec(cmd_dot, (err, stdout, stderr) => {
              if (err) { console.log(err); };
              var pg_data = fs.readFileSync(pg_file, 'utf8');
              console.log(pg_data);
              var vis_path = 'tmp/' + id + '/tmp.png';
              var body = { pg:pg_data, vis:vis_path };
              returnResult(res, body);
            });
          });
        });
      });
    });
  });
});

//function returnResult(res, body) {
var returnResult = function(res, body) {
  res.set('Content-Type', 'application/json');
  res.json(body);
};

var saveAsFile = function(data, filepath) {

};
