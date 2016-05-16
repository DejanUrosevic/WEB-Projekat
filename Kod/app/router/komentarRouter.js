var express = require('express');

var Comment = require(__dirname + '/../model/comment');
var Zadatak = require(__dirname + '/../model/zadatak');

var komentarRouter = express.Router();

komentarRouter
.get('/', function(req, res) {
  //console.log("Korisnik : " + req.success.user.email);
  if(req.session.user || (req.session.user !== undefined)){
    var entry={};
    Comment.find(entry).exec(function(err, data, next) {
      if(err){
        console.log(err);
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
    Comment.findOne({"_id": req.params.id}).exec(function(err, data, next) {
      res.json(data);
    });
  }else{
    res.redirect('/blog/indexx.com');
  }
})
.delete('/:id', function(req, res, next) {
  if(req.session.user || (req.session.user !== undefined)){
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
  }else{
    res.redirect('/blog/indexx.html');
  }
})
.put('/:id', function(req, res, next) {
  if(req.session.user || (req.session.user !== undefined)){
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
  }else{
    res.redirect('/blog/indexx.com');
  }
})
.post('/', function(req, res, next) {
  if(req.session.user || (req.session.user !== undefined)){
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
  }else{
    res.redirect('/blog/indexx.html');
  }
});


module.exports = komentarRouter;