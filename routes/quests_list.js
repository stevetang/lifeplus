var express = require('express');
var router = express.Router();

// Mongodb var
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/lifeplusdb';

var findQuests = function(db, resultset, callback) {
  var cursor = db.collection('quests').find({}, {_id: 0});
  var i = 0;

  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      resultset.rows[i++] = doc;
    } else {
      callback();
    }
  });
};

/* GET users listing. */
router.post('/', function(req, res, next) {

  var resultset = {"rows": []};

  MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err);
  	findQuests(db, resultset, function(){

      if (resultset != null) {
        res.render("quests_list",
        { quests: resultset});
      }
  	  db.close();

  	});
  });

});

module.exports = router;