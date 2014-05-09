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

function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDateRange() {
	//first select a random year
	var year = getRandomInt(1960, 2013);
	//then a month
	var month = getRandomInt(1,12);

	var monthStr = month<10?"0"+month:month;
	//lame logic for end of month
	var eom = month==2?28:30;
	var beginDateStr = year + "-" + monthStr + "-01";
	var endDateStr = (year+4) + "-" + monthStr + "-" + eom;

  return beginDateStr+"%2C"+endDateStr;

}
/*var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port);*/

app.get('/', function (req, res) {


  // marvel.characters.findByName('spider-man')
  // .then(function(hero) {
    // console.log('Found character ID', hero.data[0].id);
    // res.render('index',
  // { title : hero.data[0].id,
    // name : hero.data[0].name ,
    // description : hero.data[0].description,
    // image : hero.data[0].thumbnail.path + "\/detail.jpg" }
  // )
    // return marvel.characters.comics(hero.data[0].id);
  // })
  marvel.comics.findByDateRange(100, getRandomDateRange())
  .then(function(comics) {
  var error = new Error("The error message");
  var filteredComics = [];
	for (var j = 0; j < comics.data.length; j++) {
    if (comics.data[j].thumbnail.path != "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available")
    {
      filteredComics.push(comics.data[j]);
    }
  }

  res.render('index',
   { comics: filteredComics
	}
   )

    //console.log('found %s comics of %s total', comics.meta.count, comics.meta.total);
    //console.log(comics.data);
  })
  .fail(console.error)
  .done();

})

app.listen(1337)
