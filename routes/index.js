var express = require('express');
var router = express.Router();

// Mongodb var
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/lifeplusdb';

var findCategories = function(db, rtndocs, callback) {
  var cursor = db.collection('challenge_categories').find({}, {_id: 0});
  var i = 0;

  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      rtndocs.datastr[i++] = doc;
    } else {
      callback();
    }
  });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  var docs = {"datastr": []};

  MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err);
  	findCategories(db, docs, function(){

      if (docs != null) {
        res.render("index",
        { categories: docs});
      }

  	  db.close();
  	});
  });

});

module.exports = router;