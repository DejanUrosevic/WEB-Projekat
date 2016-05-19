var express = require('express');

var Korisnik = require('./../model/korisnik');

var korisnikRouter = express.Router();

korisnikRouter
.get('/', function(req, res) {
  console.log(req.isAuthenticated());
{
	 var entry={};
	 Korisnik.find(entry).populate('zadatak').exec(function(err, data, next) {
		res.json(data);
	 });
  }
})
.get('/:id', function(req, res) {
  if(req.isAuthenticated()){
	 Korisnik.findOne({"_id": req.params.id}).populate('projekti').populate('zadatak').exec(function(err, data, next) {
		res.json(data);
	 });
  }
})
.post('/', function(req, res, next) {
    var korisnik = new Korisnik(req.body);
    korisnik.save(function(err, entry) {
      if (err) {
        console.log(err);
        next(err);
        return;
      } 
      res.json(entry);
    });
})
.delete('/:id', function(req, res, next) {
  if(req.isAuthenticated()){
  	Korisnik.remove({
  		"_id": req.params.id
  	}, function(err, successIndicator) {
  		if (err) next(err);
  		res.json(successIndicator);
  	});
  }
})


module.exports = korisnikRouter;