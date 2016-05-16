var express = require('express');

var Zadatak = require(__dirname + '/../model/zadatak');
var Projekat = require(__dirname + '/../model/projekat');
var Korisnik = require(__dirname + '/../model/korisnik');

var projekatRouter = express.Router();

projekatRouter
.get('/', function(req, res) {
  console.log("Korisnik na sesiji projekat : "+req.session.user);
  if(req.session.user || (req.session.user !== undefined)){
    var entry={};
    Projekat.find(entry).populate('korisnici').populate('zadatak').exec(function(err, data, next) {
     
       res.json(data);
    });
  }else{
    res.redirect('/blog/indexx.html');
  }
})
.get('/:id', function(req, res) {
  if(req.session.user || (req.session.user !== undefined)){
    Projekat.findOne({"_id": req.params.id}).populate('korisnici').populate('zadatak').exec(function(err, data, next) {
      res.json(data);
    });
  }else{
    res.redirect('/blog/indexx.html');
  }
})
.post('/', function(req, res, next) 
{
  if(req.session.user || (req.session.user !== undefined)){
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
  }else{
    res.redirect('/blog/indexx.html');
  }
})
.post('/zadatak', function(req, res, next) 
{
  if(req.session.user || (req.session.user !== undefined)){ 
    var zadatak = new Zadatak(req.body);
    if(req.body.korisnik !== null || req.body.korisnik !== undefined)
    {
      Korisnik.findByIdAndUpdate(req.body.korisnik, {$push:{"zadatak":zadatak}}, function (err, entry) 
      {
        if(err)
        {
          console.log(err);
          next(err);
        }
      });
    }
    Projekat.findOne({"oznaka": zadatak.oznaka},function (err, entry) {
      if(err){
        next(err);
      }
      
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
  }else{
    res.redirect('/blog/indexx.html');
  }
})
.get('/:id/zadatak', function(req, res) {
  if(req.session.user || (req.session.user !== undefined)){
    var entry={"_id":req.params.id};
    Projekat.findOne(entry).populate('korisnici').populate('zadatak').exec(function(err, data, next) {
      console.log(data.zadatak);
      res.json(data.zadatak); 
    });
  }else{
    res.redirect('/blog/indexx.html');
  }
})
.get('/:id/korisnik', function(req, res) {
  if(req.session.user || (req.session.user !== undefined)){
    var entry={"_id":req.params.id};
    Projekat.findOne(entry).populate('korisnici').populate('zadatak').exec(function(err, data, next) {
      console.log(data.korisnici);
      res.json(data.korisnici); 
    });
  }else{
    res.redirect('/blog/indexx.html');
  }
})
.put('/:id', function(req, res, next) {
  if(req.session.user || (req.session.user !== undefined)){
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
  }else{
    res.redirect('/blog/indexx.html');
  }
})
.put('/:id/dodajKor', function(req, res, next) {
  if(req.session.user || (req.session.user !== undefined)){
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
  }else{
    res.redirect('/blog/indexx.html');
  }
});

module.exports = projekatRouter;