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
    }, function(err, comment) {
      if (err){
        console.log(err);
        next(err);
      }   
      var newEntry = req.body.params.tekst;
      comment.tekst = newEntry;
      comment.save(function(err, data) {
        if (err){
          console.log(err);
          next(err);
        } 
        res.json(data);
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


module.exports = komentarRouter;