var express = require('express');
var router = express.Router();

// Mongodb var
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/lifeplusdb';

var addQuest = function(db, req, callback) {
  var col = db.collection('quests');
  col.insertOne({
      "title": req.body.nQuestTitle, 
      "description": req.body.nQuestDesc}, function(err, r) {
      assert.equal(null, err);
      callback();
    });
}

/* GET home page. */
router.post('/', function(req, res, next) {

  if(req.body.nSave == 'addtasks'){
    res.redirect('/addtasks?questid=' + req.body.questid);
  }

  if (req.body.nSave == 'save') {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      addQuest(db, req, function(){
        db.close();
        res.redirect('/questlist');
      });
    });
  }

});

module.exports = router;