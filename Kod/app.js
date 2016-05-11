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

var komentarRouter = require(__dirname + '/app/router/komentarRouter');
var korisnikRouter = require(__dirname + '/app/router/korisnikRouter');
var projekatRouter = require(__dirname + '/app/router/projekatRouter');
var zadatakRouter = require(__dirname + '/app/router/zadatakRouter');

mongoose.connect('mongodb://localhost/blogApp');

//console.log(session);
// konfigurisemo bodyParser()
// da bismo mogli da preuzimamo podatke iz POST zahteva
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
var port = process.env.PORT || 8080; // na kom portu slusa server

//inicijalizacija sesije
var sess;
app.use(session({secret: 'ssshhhhh'}));


// dodavanje rutera za blogEntries /api/blogEntries
app.use('/api/korisnik', korisnikRouter);
app.use('/api/projekat', projekatRouter);
app.use('/api/zadatak', zadatakRouter);
app.use('/api/comment', komentarRouter);
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

