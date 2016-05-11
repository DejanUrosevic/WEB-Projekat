var express = require('express');

var Comment = require(__dirname + '/../model/comment');
var Zadatak = require(__dirname + '/../model/zadatak');

var komentarRouter = express.Router();

komentarRouter
.get('/', function(req, res) {
    var entry={};
    Comment.find(entry).exec(function(err, data, next) {
      if(err){
        console.log(err);
        next(err);
      }
      res.json(data);
    });
})
.get('/:id', function(req, res) {
    Comment.findOne({"_id": req.params.id}).exec(function(err, data, next) {
      res.json(data);
    });
})
.delete('/:id', function(req, res, next) {
    Comment.remove({
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
    Comment.findOne({
      "_id": req.params.id
    }, function(err, zadatak) {
      if (err){
        //console.log(err);
        next(err);
      }   
      var newEntry = req.body;
      console.log(newEntry.params.status);
      //{params : {status : zadatak.status}}
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
})
.post('/', function(req, res, next) 
{
    var comment = new Comment();
    comment.tekst = req.body.params.tekst;
    Zadatak.findOne({"_id":req.body.params.zadatakID},function (err, entry) {
    comment.save(function(err, comment) 
    {
        if (err)
        {
          console.log(err);
          next(err);
          return;
        }
        Zadatak.findByIdAndUpdate(entry._id, {$push:{"komentari":comment}}, function (err, entry) {
          if(err)
          {
            console.log(err);
            next(err);
          }
          res.json(entry);
        });
       
      });
    });
});

/*

.post('/', function(req, res, next) 
{
    var zadatak = new Zadatak(req.body);
    Projekat.findOne({"oznaka":req.body.sifraOznaka},function (err, entry) {
    if(err) next(err);
    zadatak.save(function (err, zadatak) {
      if(err) next(err);
      Projekat.findByIdAndUpdate(entry._id, {$push:{"zadatak":zadatak._id}}, function (err, entry) {
        if(err) next(err);
        res.json(entry);
      });
    });
  });
})
.get('/', function(req, res) {
    var entry={};
    Zadatak.find(entry).exec(function(err, data, next) {
      res.json(data);
    });
});
*/

module.exports = komentarRouter;