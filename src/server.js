// get sandbox listening config from environment
const g2gsandbox_port = process.env.G2GSANDBOX_EXTERNAL_PORT || "8080";

// get required packages
const bodyParser = require('body-parser');
const childProcess = require('child_process');
const fs = require('fs');
const express = require('express');
const mkdirp = require('mkdirp');

// declare some helper functions
const exec = childProcess.exec;
const returnResult = function (res, body) {
  res.set('Content-Type', 'application/json');
  res.json(body);
};

////////////////
// WEB SERVER //
////////////////
var app = express();

// configure middlewares
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // allow pre-flight cors requests
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});
app.use(express.static('static'));
app.use('/src', express.static('src'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// this is our endpoint
app.post('/g2g/', function (req, res) {
  // g2g output file path configuration
  var id = new Date().getTime();
  const g2g_output_root = './static/tmp/';
  const g2g_output_dir = g2g_output_root + id;
  const g2g_output_g2g = g2g_output_dir + '/tmp.g2g';
  const g2g_output_rdf = g2g_output_dir + '/tmp.ttl';
  const g2g_output_dot = g2g_output_dir + '/tmp.dot';
  const g2g_output_png = g2g_output_dir + '/tmp.png';

  console.log("A request is received (ID: " + id + ")");

  var format = req.body.format;
  if (['pg', 'pgx', 'neo', 'dot', 'aws', 'all'].indexOf(format) == -1) {
    console.log("Invalid output format specified: " + format);
    return res.send(400);
  }

  mkdirp(g2g_output_dir, function (err) {
    if (err) { console.log(err); };
    fs.writeFile(g2g_output_g2g, req.body.g2g, function (err) {
      var cmd;

      if (err) { console.log(err); };
      if (req.body.mode == "endpoint") {
        cmd = 'g2g -f ' + format + ' ' + g2g_output_g2g + ' ' + req.body.endpoint + ' -o ' + g2g_output_dir;
      } else {
        fs.writeFile(g2g_output_rdf, req.body.rdf, function (err) {
          if (err) { console.log(err); };
        });

        cmd = 'g2g -f ' + format + ' ' + g2g_output_g2g + ' ' + g2g_output_rdf + ' -o ' + g2g_output_dir;

        if (format == 'all' || format == 'dot') {
          cmd += ' && dot -Tpng < ' + g2g_output_dot + ' > ' + g2g_output_png
        }
      };
      console.log(cmd);
      exec(cmd, (err, stdout, stderr) => {
        console.log(stdout, stderr);
        if (err) { 
          pg_data = err; 
        };

        var body = { g2g_output_dir: '/tmp/' + id };
        returnResult(res, body);
      });
    });
  });
});

// start listening
app.listen(g2gsandbox_port);
console.log('Listening port is ' + g2gsandbox_port);
