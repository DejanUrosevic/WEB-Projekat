var express = require('express');

var Zadatak = require(__dirname + '/../model/zadatak');
var Projekat = require(__dirname + '/../model/projekat');
var Korisnik = require(__dirname + '/../model/korisnik');

var projekatRouter = express.Router();

projekatRouter
.get('/', function(req, res) {
    var entry={};
    Projekat.find(entry).populate('korisnici').populate('zadatak').exec(function(err, data, next) {
     
       res.json(data);
    });
})
.get('/:id', function(req, res) {
    Projekat.findOne({"_id": req.params.id}).populate('korisnici').populate('zadatak').exec(function(err, data, next) {
      res.json(data);
    });
})
.post('/', function(req, res, next) 
{
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
.post('/zadatak', function(req, res, next) 
{
    
    var zadatak = new Zadatak(req.body);
    Projekat.findOne({"oznaka":zadatak.oznaka},function (err, entry) {
    if(err) next(err);
    zadatak.save(function (err, zadatak) {
      if(err)
      {
        console.log(err);
        next(err);
      }
      Projekat.findByIdAndUpdate(entry._id, {$push:{"zadatak":zadatak}}, function (err, entry) {
        if(err)
        {
          console.log(err);
          next(err);
        } 
        res.json(entry);
      });
    });
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
.put('/:id', function(req, res, next) {
    Korisnik.findOne({
      "_id": req.body.params.korisnikID
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
      Projekat.findByIdAndUpdate(req.params.id, {$pull:{"korisnici":korisnik._id}}, function (err, entry) {   
        if (err)
        {
          console.log(err);
          next(err);
        } 
        res.json(entry);
      });
    });
})
.put('/:id/dodajKor', function(req, res, next) {
    Korisnik.findOne({
      "_id": req.body.params.korisnikID
    }, function(err, korisnik) {
      if (err)
      {
        console.log(err);
        next(err);
      }
      Korisnik.findByIdAndUpdate(korisnik._id, {$push:{"projekti":req.params.id}}, function (err) 
      {
          if(err)
          {
            console.log(err);
            next(err);
          }   
      });
      Projekat.findByIdAndUpdate(req.params.id, {$push:{"korisnici":korisnik}}, function (err, entry) {   
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