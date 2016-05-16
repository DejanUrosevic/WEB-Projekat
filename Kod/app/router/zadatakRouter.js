var express = require('express');

var Zadatak = require(__dirname + '/../model/zadatak');
var Projekat = require(__dirname + '/../model/projekat');

var zadatakRouter = express.Router();


zadatakRouter
.get('/', function(req, res) {
    //console.log("korisnik " + req.session.user.email);
  if(req.session.user || (req.session.user !== undefined)){  
    var entry={};
    Zadatak.find(entry).populate('komentari').populate('izmeneZadatka').populate('korisnik').exec(function(err, data, next) {
      if(err){
        console.log("--"+err);
        next(err);
      }
      res.json(data);
    });
  }else{
    res.redirect('/blog/indexx.html');
  }
})
.get('/:id', function(req, res) {
  if(req.session.user || (req.session.user !== undefined)){
    Zadatak.findOne({"_id": req.params.id}).populate('komentari').populate('izmeneZadatka').populate('korisnik').exec(function(err, data, next) {
      if(err){
        console.log("+++"+err);
        next(err);
      }
      res.json(data);
    });
  }else{
    res.redirect('/blog/indexx.html');
  }
})
.delete('/:id', function(req, res, next) {
  if(req.session.user || (req.session.user !== undefined)){
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
  }else{
    res.redirect('/blog/indexx.html');
  }
})
.put('/:id', function(req, res, next) {
  if(req.session.user || (req.session.user !== undefined)){
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
        //{params : {status : zadatak.status}}
        zadatak.naslov = newEntry.params.naslov;
        zadatak.opis = newEntry.params.opis;
        zadatak.status = newEntry.params.status;
        zadatak.save(function(err, zadatak) {
          if (err){
            console.log(err);
            next(err);
          } 
          res.json(zadatak);
        });
      });
    });
  }else{
    res.redirect('/blog/indexx.html');
  }
});


module.exports = zadatakRouter;