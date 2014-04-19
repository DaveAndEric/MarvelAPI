/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')

var app = express()
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

var api = require('marvel-api');

var marvel = api.createClient({
  publicKey: 'my-public-key'
, privateKey: 'my-private-key'
});

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
})


/*var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port);*/

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
  marvel.characters.findAll(function(err, results) {
  if (err) {
    return console.error(err);
  }

  console.log(results);
});
})

app.listen(1337)