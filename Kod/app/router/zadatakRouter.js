var express = require('express');

var Zadatak = require(__dirname + '/../model/zadatak');

var zadatakRouter = express.Router();


zadatakRouter
.get('/', function(req, res) {
    var entry={};
    Zadatak.find(entry).populate('komentari').exec(function(err, data, next) {
      if(err){
        console.log("--"+err);
        next(err);
      }
      res.json(data);
    });
})
.get('/:id', function(req, res) {
    Zadatak.findOne({"_id": req.params.id}).populate('komentari').exec(function(err, data, next) {
      if(err){
        console.log("+++"+err);
        next(err);
      }
      res.json(data);
    });
})
.delete('/:id', function(req, res, next) {
    Zadatak.remove({
      "_id": req.params.id
    }, function(err, successIndicator) {
      if (err)
      {
        console.log(err);
        next(err);
      } 
      res.json(successIndicator);
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
      var newEntry = req.body;
      console.log(newEntry.params.status);
      //{params : {status : zadatak.status}}
      zadatak.naslov = newEntry.params.naslov;
      zadatak.opis = newEntry.params.opis;
      zadatak.status = newEntry.params.status;
      zadatak.save(function(err, zadatak) {
        if (err){
          console.log(err);
          next(err);
        } 
        console.log('+++++++  '+ zadatak); 
        res.json(zadatak);
      });
    });
});


module.exports = zadatakRouter;