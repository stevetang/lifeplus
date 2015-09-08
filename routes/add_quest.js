var express = require('express');
var router = express.Router();

// Mongodb var
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/lifeplusdb';

var addQuest = function(db, questtitle, questdesc, subtasks, callback) {
  var col = db.collection('quests');
  var id;
  col.insertOne({
    "title": questtitle, 
    "description": questdesc}, function(err, r) {
    id = r["ops"][0]["_id"];
    assert.equal(null, err);
    //callback();
  });
  var cursor = db.collection('quests').find({_id : id});
  if (cursor ==null){
    console.log("null");
  }
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    console.log(1);
  });
  callback();
}

/* GET home page. */
router.post('/', function(req, res, next) {

  // if(req.body.nSave == 'addtasks'){
    //res.redirect('/addtasks?questid=' + req.body.questid);
  //   res.redirect('/addtasks');
  // }

  // if (req.body.nSave == 'save') {
  //console.log('innodejs');
  // console.log(req.body.nQuestTitle);
  // console.log(req.body.nQuestDesc);
  // console.log(req.body.relatedTasks);

  var subtasks = JSON.parse(req.body.relatedTasks);
  var questtitle = req.body.nQuestTitle;
  var questdesc = req.body.nQuestDesc;
  console.dir(subtasks);

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    addQuest(db, questtitle, questdesc, subtasks, function(){
      db.close();
      res.redirect('/questlist');
    });
  });
  // }

});

module.exports = router;