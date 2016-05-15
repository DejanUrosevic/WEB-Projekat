// Uvoz instaliranih modula
var express = require('express');
var cookie_parser = require('cookie-parser');
var bodyParser = require('body-parser');
var express_session = require('express-session');
var passport = require('passport');
var passport_local = require('passport-local');
var mongoose = require('mongoose');

// Uvoz modula koji predstavljaju modele baze podataka mongoDB
var Korisnik = require(__dirname + '/app/model/korisnik');
var Projekat = require(__dirname + '/app/model/projekat');
var Zadatak = require(__dirname + '/app/model/zadatak');
var Comment = require(__dirname + '/app/model/comment');

// Uvoz modula koji predstavljaju rutiranje
var korisnikRouter = require(__dirname + '/app/router/korisnikRouter');
var projekatRouter = require(__dirname + '/app/router/projekatRouter');
var zadatakRouter = require(__dirname + '/app/router/zadatakRouter');
var komentarRouter = require(__dirname + '/app/router/komentarRouter');

// Instanciramo
var app = express();

// Spajamo se na bazu podataka
mongoose.connect('mongodb://localhost/blogApp');

// Podešavanje passport-a
var LocalStrategy = passport_local.Strategy;

passport.use(new LocalStrategy(
    {
      usernameField: 'user',
      passwordField: 'pass'
    },
    function(email, lozinka, done) {
      Korisnik.findOne({email: email}, function(err, korisnik) {
        //console.log(korisnik);
        if (err) {
          return done(err);
        }

        if (!korisnik) {
          return done(null, false, {msg: 'Neispravan email.'});
        }

        if (korisnik.lozinka != lozinka) {
          return done(null, false, {msg: 'Neispravna lozinka.'})
        }

        return done(null, korisnik);
      });
    }
));

passport.serializeUser(function(korisnik, done) {
  done(null, korisnik._id);
});

passport.deserializeUser(function(_id, done) {
  Korisnik.findById(_id, function(err, korisnik) {
    done(err, korisnik);
  });
});


// Ubacimo neophodne midlewear-e
app.use(cookie_parser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express_session({secret: 'Hello, here I am'}));
app.use(passport.initialize());
app.use(passport.session());

// Dodavanje rutera
app.use('/api/korisnik', korisnikRouter);
app.use('/api/projekat', projekatRouter);
app.use('/api/zadatak', zadatakRouter);
app.use('/api/comment', komentarRouter);

//klijentsku angular aplikaciju serviramo iz direktorijuma client
app.use('/blog', express.static(__dirname + '/client'));

app.use('/login', function(req, res, next) {
  passport.authenticate('local', function(err, korisnik, info) {
    if (err) {
      return next(err);
    }
    	
    if (!korisnik) {
      return res.redirect('/blog/indexx.html');
    }

    req.logIn(korisnik, function(err) {
      if (err) {
        return next(err);
      }
          //  console.log("Request: " + req.user +  "\n");      //OVIM DOBIJAMO SAM OBJEKAT KORISNIKA
          //  console.log("Session: " + req.session.passport.user);   //OVIM DOBIJAMO SAM ID KOJI SMO SERIJALIZOVALI
        //return res.redirect('http://www.google.rs');
      return res.redirect('/blog/indexx.html#/main');
    });
  })(req, res, next);
});

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

// na kom portu slusa server
var port = process.env.PORT || 3000;

// Pokretanje servera
app.listen(port);

console.log('Server radi na portu ' + port); 
