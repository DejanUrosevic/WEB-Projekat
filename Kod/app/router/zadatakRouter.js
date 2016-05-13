var express = require('express');

var Zadatak = require(__dirname + '/../model/zadatak');
var Projekat = require(__dirname + '/../model/projekat');

var zadatakRouter = express.Router();


zadatakRouter
.get('/', function(req, res) {
    var entry={};
    Zadatak.find(entry).populate('komentari').populate('izmeneZadatka').exec(function(err, data, next) {
      if(err){
        console.log("--"+err);
        next(err);
      }
      res.json(data);
    });
})
.get('/:id', function(req, res) {
    Zadatak.findOne({"_id": req.params.id}).populate('komentari').populate('izmeneZadatka').exec(function(err, data, next) {
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
        next();
      }
      Projekat.findOne({"oznaka":data.oznaka},function (err, entry) {
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
});


module.exports = zadatakRouter;