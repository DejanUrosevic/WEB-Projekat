var express = require('express');

var Korisnik = require(__dirname + '/../model/korisnik');

var korisnikRouter = express.Router();

korisnikRouter
.get('/', function(req, res) {
    /*if(req.session.user || (req.session.user !== undefined)){
      var entry={};
      Korisnik.find(entry).populate('zadatak').exec(function(err, data, next) {
        res.json(data);
      });
    }else{
      res.redirect('/blog/indexx.html#login');
    }*/
     var entry={};
      Korisnik.find(entry).populate('zadatak').exec(function(err, data, next) {
        res.json(data);
      });
})
.get('/:id', function(req, res) {
    //console.log(req.session.user)
    if(req.session.user || (req.session.user !== undefined)){
      console.log("Korisnik na sesiji : "+req.session.user.email);  
      Korisnik.findOne({"_id": req.params.id}).populate('projekat').populate('zadatak').exec(function(err, data, next) {
        res.json(data);
      });
    }else{
      //console.log("Nema sesije");
      res.redirect('/blog/indexx.html');
      return;
    }
})
.post('/', function(req, res, next) 
{
  //if(req.session.user || (req.session.user !== undefined)){
    var korisnik = new Korisnik(req.body);
    korisnik.save(function(err, entry) 
    {
      if (err)
      {
        console.log(err);
        next(err);
        return;
      } 
      res.json(entry);
    });
  /*}else{
    res.redirect('/blog/indexx.html');
  }*/
})
.delete('/:id', function(req, res, next) {
  if(req.session.user || (req.session.user !== undefined)){
    Korisnik.remove({
      "_id": req.params.id
    }, function(err, successIndicator) {
      if (err) next(err);
      res.json(successIndicator);
    });
  }else{
    res.redirect('/blog/indexx.html');
  }
})
/*
.post('/test', function(req, res) {
    var entry={"email": req.body.user};
    Korisnik.findOne(entry).exec(function(err, data, next) {
      res.json(data);
    });
  });
*/
/*
//OVO NIJE POTREBNO RADI SE PREKO PASSPORT
.post('/test', function(req, res, next){
  sess = req.session;
  console.log(sess);
  Korisnik.findOne({"email" : req.body.user}).exec(function(err, data, next){
    var kor;
    if(data !== null){
    //  console.log(data.email + "------");
      if(data.lozinka === req.body.pass){
      //  console.log("logovan");
        kor = data;
        sess.email = req.body.user;
        if(kor.vrsta == 'admin')
        {
          res.redirect("http://localhost:8080/blog/indexx.html#/main");
          return;
        }
        else
        {
          res.redirect("http://localhost:8080/blog/indexx.html#/reg");
          return;
        }
        //console.log(kor);
        
      }else{
      //  console.log("losa lozinka");
        res.redirect("blog/indexx.html");
        return;
      }
    }else{
    //  console.log("null");
      res.redirect("/blog/indexx.html");
      return;
    }
  });
  //console.log(req.body.user + " " + req.body.pass);
})
.get('/proba', function(req, res, next){
  var k = req.session.user;
  console.log(req.session.user);
});
*/

module.exports = korisnikRouter;