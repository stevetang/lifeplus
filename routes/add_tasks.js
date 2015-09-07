var express = require('express');
var router = express.Router();

// Mongodb var
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/lifeplusdb';

var addTask = function(db, req, callback) {
  var col = db.collection('tasks');
  col.insertOne({
      "title": req.body.taskTitle,  
      "description": req.body.nTaskDesc,
      "description": req.body.nTaskDesc}, function(err, r) {
      assert.equal(null, err);
      callback();
    });
}

var getTasks = function(db, resultset, callback) {
  var cursor = db.collection('tasks').find({}, {_id: 0});
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

router.get('/', function(req, res, next) {

  var resultset = {"rows": []};

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    getTasks(db, resultset, function(){

      if (resultset != null) {
        res.render("add_tasks",
        { tasks: resultset, questid: req.query.questid});
      }
      db.close();

    });
  });

});

router.post('/', function(req, res, next) {

  console.log(req.body.nTaskTitle);
  console.log(req.body.nTaskDesc);
  console.log(req.body.nTimerValidator);
  console.log(req.body.nCheckinValidator);
  console.log(req.body.nAPIValidator);

});

module.exports = router;