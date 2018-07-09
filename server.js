
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var childProcess = require('child_process');

var port=8080;
var date = new Date();
const execSync = childProcess.execSync;

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
        var result = execSync('g2g pg ' + g2g_file + ' ' + rdf_file + ' ./tmp/' + id).toString();
        var pg_data = fs.readFileSync(pg_file, 'utf8');
        console.log(pg_data);
        var body = { pg:pg_data };
        returnResult(res, body);
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
