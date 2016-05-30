var express = require('express');

var Zadatak = require('./../model/zadatak');
var Projekat = require('./../model/projekat');
var Korisnik = require('./../model/korisnik');

var projekatRouter = express.Router();

projekatRouter
.get('/', function(req, res) {
  var entry={};
  Projekat.find(entry).populate('korisnici').populate('zadatak').exec(function(err, data, next) {

    res.json(data);
  });
})
.get('/:id', function(req, res) {
 /* Projekat.findOne({"_id": req.params.id}).populate('korisnici').populate('zadatak').exec(function(err, data, next) {
    res.json(data);
  }); */
  Projekat.findOne({"_id": req.params.id}).populate('korisnici').populate({path:'zadatak', populate: {path: 'autor'}}).populate({path:'zadatak', populate: {path: 'korisnik'}}).exec(function(err, data, next) {
    res.json(data);
  });
})
.post('/', function(req, res, next) {
  var projekat = new Projekat(req.body);

  projekat.save(function(err, entry)
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
.get('/:id/zadatak', function(req, res) {
  var entry={"_id":req.params.id};
  Projekat.findOne(entry).populate('korisnici').populate('zadatak').exec(function(err, data, next) {
    console.log(data.zadatak);
    res.json(data.zadatak);
  });
})
.get('/:id/korisnik', function(req, res) {
  var entry={"_id":req.params.id};
  Projekat.findOne(entry).populate('korisnici').populate('zadatak').exec(function(err, data, next) {
    console.log(data.korisnici);
    res.json(data.korisnici);
  });
})
.put('/:id/obrisi/:korId', function(req, res, next) {
    console.log("dasdasasdasds");
    Korisnik.findOne({
      "_id": req.params.korId
    }, function(err, korisnik) {
    if (err)
    {
      console.log(err);
      next(err);
    }
    Korisnik.findByIdAndUpdate(korisnik._id, {$pull:{"projekti":req.params.id}}, function (err)
    {
    if(err)
    {
      console.log(err);
      next(err);
    }
    });
    Projekat.findByIdAndUpdate(req.params.id, {$pull:{"korisnici":korisnik.id}}, function (err, entry) {
    if (err)
    {
      console.log(err);
      next(err);
    }
    res.json(entry);
   });
  });
})
.put('/:_id/dodaj/:korId', function(req, res, next) {
  Korisnik.findOne({
    "_id": req.params.korId
  }, function(err, korisnik) {
    if (err)
    {
      console.log(err);
      next(err);
    }
    Korisnik.findByIdAndUpdate(korisnik._id, {$push:{"projekti":req.params._id}}, function (err)
    {
      if(err)
      {
        console.log(err);
        next(err);
      }
    });
    Projekat.findByIdAndUpdate(req.params._id, {$push:{"korisnici":korisnik._id}}, function (err, entry) {
      if (err)
      {
        console.log(err);
        next(err);
      }

      res.json(entry);
    });
  });
});

module.exports = projekatRouter;