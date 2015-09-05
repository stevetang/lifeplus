var express = require('express');
var router = express.Router();

// Mongodb var
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/lifeplusdb';

var findUsers = function(db, res, user, password, callback) {
  var cursor = db.collection('users').find({name: user, password: password});
  
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      res.render("login", {message: "Success", error: {}});
    } else {
      res.render("login", {message: "FAILURE", error: {}});
      callback();
    }
  });
};

router.post('/', function(req, res, next) {

  MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err);
    var username = req.body.nInputEmail;
    var password = req.body.nInputPassword
  	findUsers(db, res, username, password, function(){
  	  db.close();
  	});
  });

});

module.exports = router;