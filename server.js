/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')

var sleep = require('sleep');

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

var fs = require('fs'),
request = require('request');

//default not avail image
var IMAGE_NOT_AVAIL = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

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

app.get('/', function (req, res) {

  marvel.comics.findByDateRange(100, getRandomDateRange())
  .then(function(comics) {
  var error = new Error("The error message");
  var filteredComics = [];

	for (var j = 0; j < comics.data.length; j++) {

    if (comics.data[j].thumbnail.path != "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available")
    {

      if (fs.existsSync("public/images/" + comics.data[j].id + ".jpg"))
      {
        filteredComics.push(".\/images/" + comics.data[j].id + ".jpg");
      }
      else
      {
        download("" + comics.data[j].thumbnail.path + "\/portrait_uncanny.jpg", "public\/images\/" + comics.data[j].id + ".jpg", function(){
          console.log('done - ');
        });
        filteredComics.push(comics.data[j].thumbnail.path + "\/portrait_uncanny.jpg");
      }


    }
  }
  //sleep.sleep(10);
   res.render('index',
   { comics: filteredComics,
	}
   )


  })
  .fail(console.error)
  .done();

})

var port = Number(process.env.PORT || 5000);
app.listen(process.env.PORT)
