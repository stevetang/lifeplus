var express = require('express');
var router = express.Router();

// Mongodb var
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/lifeplusdb';
var ObjectId = require('mongodb').ObjectID;

var findQuests = function(db, questid, data, callback) {
  var cursor = db.collection('quests').find({_id: ObjectId(questid)});
  var i = 0;

  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      data.title = doc.title;
      data.desc = doc.description;
    } else {
      callback();
    }
  });
}

var findTasks = function(db, data, questid, callback) {
  var cursor = db.collection('tasks').find({questid: ObjectId(questid)});
  var i = 0;

  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      data.tasks[i] = doc;
      i++;
    } else {
      callback();
    }
  });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  var data = {title: '', desc: '', tasks: []};

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findQuests(db, req.query.questid, data, function(){
      // console.dir(data);
      findTasks(db, data, req.query.questid, function(){
      	db.close();
        //console.dir(data);
        var result = {id: req.query.questid, title: data.title, desc: data.desc, tasks: JSON.stringify(data.tasks)};
        // console.dir('start');
        // console.dir(req.query.questid);
        // console.dir(data.title);
        // console.dir(data.desc);
        // console.dir(JSON.stringify(data.tasks));
        res.render('create_quest', {quests: result});
      })
    });
  });

});

router.post('/', function(req, res, next) {
  var result = {id: req.body.hiddenQuestId, title: req.body.hiddenQuestTitle, desc: req.body.hiddenQuestDesc, tasks: ''};
  // console.dir(result);
  res.render('create_quest', {quests: result});
});

module.exports = router;