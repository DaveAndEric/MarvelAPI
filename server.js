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
  publicKey: 'c03e2a33289649508433c722c525b6f4'
, privateKey: '5933ef0d40037d832df99e50ab9ec5b554b5f0f5'
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


/*var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port);*/

app.get('/', function (req, res) {
  
  var id = 1009000 + Math.floor((Math.random() * 1000))
  console.log('DLT' + id)
  marvel.characters.find(id)
  .then(function(hero) {
    console.log('Found character ID', hero.data[0].id);
    res.render('index',
  { title : hero.data[0].id, 
    name : hero.data[0].name , 
    description : hero.data[0].description,
    image : hero.data[0].thumbnail.path + "\/detail.jpg" }
  )
    //return marvel.characters.comics(hero.data[0].id);
  })
  .fail(console.error)
  .done();
  
})

app.listen(1337)