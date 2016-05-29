var express = require('express');

var Zadatak = require('./../model/zadatak');
var Projekat = require('./../model/projekat');
var Korisnik = require('./../model/korisnik');

var zadatakRouter = express.Router();

zadatakRouter
.get('/', function(req, res) {
  var entry={};
  Zadatak.find(entry).populate('komentari').populate('izmeneZadatka').populate('autor').populate('korisnik').exec(function(err, data, next) {
    if(err){
      console.log("--"+err);
      next(err);
    }
    res.json(data);
  });
})
.get('/:id', function(req, res) {
  Zadatak.findOne({"_id": req.params.id}).populate('komentari').populate('izmeneZadatka').populate('autor').populate('korisnik').exec(function(err, data, next) {
    if(err){
      console.log("+++"+err);
      next(err);
    }
    res.json(data);
  });
})
.delete('/:id', function(req, res, next) {
  Zadatak.findOne({"_id": req.params.id}).exec(function(err, data, next) {
    if(err)
    {
      console.log(err);
      next(err);
    }
    Projekat.findOne({"oznaka":data.oznaka},function (err, entry) {
      if(err)
      {
        console.log(err);
        next(err);
      }
      Zadatak.remove({
        "_id": req.params.id
      }, function(err, successIndicator) {
        if (err)
        {
          console.log(err);
          next(err);
        }
        Projekat.findByIdAndUpdate(entry._id, {$pull:{"zadatak":data._id}}, function (err, entry) {
          if(err)
          {
            console.log(err);
            next(err);

          }
        });
        res.json(successIndicator);
      });
    });
  });
})
.post('/', function(req, res, next) {
  var zadatak = new Zadatak(req.body);
  zadatak.autor = req.user;

  if(req.body.korisnik !== null || req.body.korisnik !== undefined) {
    Korisnik.findByIdAndUpdate(req.body.korisnik, {$push:{"zadatak":zadatak}}, function (err, entry) {
      if(err) {
        console.log(err);
        next(err);
      }
    });
  }
  Projekat.findOne({"oznaka": zadatak.oznaka},function (err, entry) {
    if(err) {
      next(err);
    }

    zadatak.save(function (err, zadatak) {
      if(err) {
        console.log(err);
        next(err);
      }
      Projekat.findByIdAndUpdate(entry._id, {$push:{"zadatak":zadatak}}, function (err, entry) {
        if(err) {
          console.log(err);
          next(err);
        }
        res.json(entry);
      });
    });
  });
})
.put('/:id', function(req, res, next) {
  Zadatak.findOne({
    "_id": req.params.id
  }, function(err, zadatak) {
    if (err){
      console.log(err);
      next(err);
    }
    Zadatak.findByIdAndUpdate(zadatak._id, {$push:{"izmeneZadatka":zadatak}}, function (err, entry)
    {
      var newEntry = req.body;
      zadatak.naslov = newEntry.naslov;
      zadatak.opis = newEntry.opis;
      zadatak.status = newEntry.status;
      zadatak.prioritet = newEntry.prioritet;
      zadatak.korisnik = newEntry.korisnik;
      zadatak.save(function(err, zadatak) {
        if (err){
          console.log(err);
          next(err);
        }
        Korisnik.findByIdAndUpdate(newEntry.korisnik, {$push: {"zadatak": zadatak._id}}, function(err){
          if(err){
            console.log(err);
            next(err);
          }
        });

        Korisnik.findByIdAndUpdate(entry.korisnik, {$pull: {"zadatak": zadatak._id}}, function(err){
          if(err){
            console.log(err);
            next(err);
          }
        });
        res.json(zadatak);
      });
    });
  });
});

module.exports = zadatakRouter;