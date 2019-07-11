// $ export G2GSANDBOX_EXTERNAL_HOST="http://localhost"
// $ export G2GSANDBOX_EXTERNAL_PORT="8080"
// $ node server.js

// sandbox listening config
var g2gsandbox_host = "http://localhost"
if (process.env.G2GSANDBOX_EXTERNAL_HOST != null) {
  g2gsandbox_host = process.env.G2GSANDBOX_EXTERNAL_HOST
}
var g2gsandbox_port = "8080"
if (process.env.G2GSANDBOX_EXTERNAL_PORT != null) {
  g2gsandbox_port = process.env.G2GSANDBOX_EXTERNAL_PORT
}
const g2gsandbox_external_url = g2gsandbox_host + ":" + g2gsandbox_port

var bodyParser = require('body-parser');
var childProcess = require('child_process');
var fs = require('fs');
var express = require('express');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
const exec = childProcess.exec;

// WEB SERVER
var app = express();
app.use(express.static('static'))
app.use(express.static('src')) // テンプレート化までの暫定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.listen(g2gsandbox_port);
console.log('Listening port is ' + g2gsandbox_port);

app.get('/', function () {
  returnResult(res, "index.html")
})

app.get('/index.js', function () { // テンプレート化までの暫定
  returnResult(res, "src/index.js")
})

app.get('/server.js', function () {
  returnResult(res, "src/server.js")
})

app.post('/g2g/', function (req, res) {
  // g2g output file path configuration
  var id = new Date().getTime();
  const g2g_output_root = './static/tmp/'
  const g2g_output_dir = g2g_output_root + id;
  const g2g_output_g2g = g2g_output_dir + '/tmp.g2g';
  const g2g_output_rdf = g2g_output_dir + '/tmp.ttl';
  const g2g_output_dot = g2g_output_dir + '/tmp.dot';
  const g2g_output_png = g2g_output_dir + '/tmp.png';

  console.log("A request is received (ID: " + id + ")");
  mkdirp(g2g_output_dir, function (err) {
    if (err) { console.log(err); };
    fs.writeFile(g2g_output_g2g, req.body.g2g, function (err) {
      var cmd;
      var cmd_dot;
      if (err) { console.log(err); };
      if (req.body.mode == "endpoint") {
        cmd = 'g2g -f all ' + g2g_output_g2g + ' ' + req.body.endpoint + ' -o ' + g2g_output_dir;
      } else {
        fs.writeFile(g2g_output_rdf, req.body.rdf, function (err) {
          if (err) { console.log(err); };
        });
        cmd_dot = 'dot -Tpng < ' + g2g_output_dot + ' > ' + g2g_output_png;
        cmd = 'g2g -f all ' + g2g_output_g2g + ' ' + g2g_output_rdf + ' -o ' + g2g_output_dir + ' && ' + cmd_dot;
      };
      console.log("The mode is: " + req.body.mode);
      console.log(cmd);
      exec(cmd, (err, stdout, stderr) => {
        console.log(stdout, stderr);
        if (err) { pg_data = err; };
        cmd = 'g2g -f all ' + g2g_output_g2g + ' ' + req.body.endpoint + ' -o ' + g2g_output_dir;
        var body = { g2g_output_dir: g2gsandbox_external_url + '/tmp/' + id };
        returnResult(res, body);
      });
    });
  });
});

var returnResult = function (res, body) {
  res.set('Content-Type', 'application/json');
  res.json(body);
};
