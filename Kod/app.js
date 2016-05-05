var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// koristimo mongoose model koju smo kreirali u folderu model
var BlogEntry = require(__dirname + '/app/model/blogEntry');
var Comment = require(__dirname + '/app/model/comment');
var Korisnik = require(__dirname + '/app/model/korisnik');


mongoose.connect('mongodb://localhost/blogApp');


// konfigurisemo bodyParser()
// da bismo mogli da preuzimamo podatke iz POST zahteva
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
var port = process.env.PORT || 8080; // na kom portu slusa server

// ruter za blogEntries
var blogEntryRouter = express.Router(); // koristimo express Router

// definisanje ruta za blog
blogEntryRouter.post('/', function(req, res, next) 
{
    var blogEntry = new BlogEntry(req.body);
    blogEntry.save(function(err, entry) 
    {
      if (err)
      {
      	console.log(err);
      	next(err);
      	return;
      } 
      res.json(entry);

    });
});

var korisnikRouter = express.Router();

korisnikRouter.post('/', function(req, res, next) 
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
});

// dodavanje rutera zu blogEntries /api/blogEntries
app.use('/api/blogEntries', blogEntryRouter);
app.use('/api/korisnik', korisnikRouter);
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


console.log('Server radi nadasdasdasd portu ' + port);
