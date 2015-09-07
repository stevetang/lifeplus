var express = require('express');
var router = express.Router();

// Mongodb var
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/lifeplusdb';

var findUsers = function(db, res, user, password, callback) {
  var cursor = db.collection('users').find({name: user, password: password});
  var i = 0;
  
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if(doc != null){
      i++;
      console.log(i);
      callback();
    } else {
      console.log(i);
      if(i == 0) {
        db.close();
        console.log('get in OMG');
        res.render("login", {message: "FAILURE", error: {}});
      }
    }
  });

};

router.post('/', function(req, res, next) {

  MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err);
    var username = req.body.nInputEmail;
    var password = req.body.nInputPassword
  	findUsers(db, res, username, password, function(){
      res.redirect('/questlist');
  	});
  });

});

module.exports = router;