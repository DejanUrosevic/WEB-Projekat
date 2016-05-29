// Uvoz instaliranih modula
var express = require('express');
var cookie_parser = require('cookie-parser');
var body_parser = require('body-parser');
var express_session = require('express-session');
var passport = require('passport');
var passport_local = require('passport-local');
var mongoose = require('mongoose');

// Uvoz modula koji predstavljaju modele baze podataka mongoDB
var Korisnik = require('./app/model/korisnik');
var Projekat = require('./app/model/projekat');
var Zadatak = require('./app/model/zadatak');
var Comment = require('./app/model/comment');

// Uvoz modula koji predstavljaju rutiranje
var korisnikRouter = require('./app/router/korisnikRouter');
var projekatRouter = require('./app/router/projekatRouter');
var zadatakRouter = require('./app/router/zadatakRouter');
var komentarRouter = require('./app/router/komentarRouter');

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
        if (err) {
          return done(err);
        }

        if (!korisnik) {
          return done(null, false, {msg: 'Neispravan email.'});
        }

        if (korisnik.lozinka != lozinka) {
          return done(null, false, {msg: 'Neispravna lozinka.'});
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

//
var isLoggedInInterceptor = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/slickTask/indexx.html#/login');
  }
};

// Ubacimo neophodne midlewear-e
app.use(cookie_parser());
app.use(body_parser.urlencoded({
  extended: true
}));
app.use(body_parser.json());
app.use(express_session({secret: 'Hello, here I am'}));
app.use(passport.initialize());
app.use(passport.session());

// Dodavanje rutera
app.use('/api/korisnik',/* isLoggedInInterceptor,*/ korisnikRouter);
app.use('/api/projekat', isLoggedInInterceptor, projekatRouter);
app.use('/api/zadatak', isLoggedInInterceptor, zadatakRouter);
app.use('/api/comment', isLoggedInInterceptor, komentarRouter);

//klijentsku angular aplikaciju serviramo iz direktorijuma client
app.use('/slickTask', express.static(__dirname + '/client'));

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, korisnik, info) {
    if (err) {
      return next(err);
    }
    	
    if (!korisnik) {
      // return res.redirect('/SlicTask/indexx.html');
      return res.json({});
    }

    req.logIn(korisnik, function(err) {
      if (err) {
        return next(err);
      }

      req.session.user = korisnik;                                                // TODO proveriti ovo

      /*
      if(korisnik.vrsta === 'admin'){
        return res.redirect('/SlicTask/indexx.html#/main');
      }else if(korisnik.vrsta === 'korisnik'){
        return res.redirect('/SlicTask/indexx.html#/korisnik/'+korisnik._id);
      }else{
        return res.redirect('/SlicTask/indexx.html#/login');
      }
      */

      return res.json({status: true, korisnik: korisnik});
    });
  })(req, res, next);
});

app.get('/logout', function(req, res, next) {
  delete req.session.user;                                                      // TODO proveriti ovo

  req.logout();

  res.redirect('/slickTask/indexx.html#/login');
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
var port = process.env.PORT || 8080;

// Pokretanje servera
app.listen(port);

console.log('Server radi na portu ' + port); 
