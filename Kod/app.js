var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
// koristimo mongoose model koju smo kreirali u folderu model
var Comment = require(__dirname + '/app/model/comment');
var Korisnik = require(__dirname + '/app/model/korisnik');
var Projekat = require(__dirname + '/app/model/projekat');
var Zadatak = require(__dirname + '/app/model/zadatak');


mongoose.connect('mongodb://localhost/blogApp');

//console.log(session);
// konfigurisemo bodyParser()
// da bismo mogli da preuzimamo podatke iz POST zahteva
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
var port = process.env.PORT || 8080; // na kom portu slusa server

var sess;


var korisnikRouter = express.Router();

korisnikRouter
.get('/', function(req, res) {
    var entry={};
    Korisnik.find(entry).exec(function(err, data, next) {
      res.json(data);
    });
  })
.post('/', function(req, res, next) 
{
    var korisnik = new Korisnik(req.body);
    korisnik.save(function(err, entry) 
    {
      if (err)
      {
      	console.log(err);
      	next(err);
      	return;
      } 
      res.json(entry);
    });
})
.post('/test', function(req, res, next){
	sess = req.session;
	console.log(sess);
	Korisnik.findOne({"email" : req.body.user}).exec(function(err, data, next){
		var kor;
		if(data !== null){
			console.log(data.email + "------");
			if(data.lozinka === req.body.pass){
				console.log("logovan");
				kor = data;
				//console.log(kor);
				res.redirect("http://localhost:8080/blog/indexx.html#/main");
				return;
			}else{
				console.log("losa lozinka");
				res.redirect("blog/indexx.html");
				return;
			}
		}else{
			console.log("null");
			res.redirect("/blog/indexx.html");
			return;
		}
	});
	//console.log(req.body.user + " " + req.body.pass);
})
.get('/proba', function(req, res, next){
	var k = req.session.user;
	console.log(k);
});


var projekatRouter = express.Router();

projekatRouter
.get('/', function(req, res) {
    var entry={};
    Projekat.find(entry).exec(function(err, data, next) {
      res.json(data);
    });
});

// dodavanje rutera za blogEntries /api/blogEntries
app.use('/api/korisnik', korisnikRouter);
app.use('/api/projekat', projekatRouter);
//klijentsku angular aplikaciju serviramo iz direktorijuma client
app.use('/blog', express.static(__dirname + '/client'));
app.use('/lib', express.static(__dirname + '/bower_components'));


//na kraju dodajemo middleware za obradu gresaka
app.use(function(err, req, res, next) {
  var message = err.message;
  var error = err.error || err;
  var status = err.status || 500;

  res.status(status).json({
    message: message,
    error: error
  });
});


// Pokretanje servera
app.listen(port);




console.log('Server radi na portu ' + port); 

