var express = require('express');

var Comment = require('./../model/comment');
var Zadatak = require('./../model/zadatak');

var komentarRouter = express.Router();

komentarRouter
.get('/', function(req, res) {
  var entry={};
  Comment.find(entry).populate('autor').exec(function(err, data, next) {
    if(err){
      console.log(err);
      next(err);
    }
    res.json(data);
  });
})
.get('/:id', function(req, res) {
  Comment.findOne({"_id": req.params.id}).populate('autor').exec(function(err, data, next) {
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
    var newEntry = req.body;
    comment.tekst = newEntry.tekst;
    comment.save(function(err, data) {
      if (err){
        console.log(err);
        next(err);
      }
      res.json(data);
    });
  });
})
.post('/zadatak/:zadId/autor/:korId', function(req, res, next) {

  var comment = new Comment(req.body);
  comment.autor = req.params.korId;
  Zadatak.findOne({"_id": req.params.zadId},function (err, entry) {
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