
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var port=8080;

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
  console.log(req.body.rdf);
  var pg_data = fs.readFileSync("g2gml/examples/mini_01.pg", "utf8");
  console.log(pg_data);
  var body = { pg:pg_data };
  returnResult(res, body);
});

function returnResult(res, body) {
  res.set('Content-Type', 'application/json');
  res.json(body);
}

