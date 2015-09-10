var express = require('express');
var router = express.Router();

// Mongodb var
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/lifeplusdb';
var ObjectId = require('mongodb').ObjectID;

// var addTask = function(db, req, callback) {
//   var col = db.collection('tasks');
//   col.insertOne({
//       "title": req.body.taskTitle,  
//       "description": req.body.nTaskDesc,
//       "description": req.body.nTaskDesc}, function(err, r) {
//       assert.equal(null, err);
//       callback();
//     });
// }

// var getTasks = function(db, resultset, callback) {
//   var cursor = db.collection('tasks').find({}, {_id: 0});
//   var i = 0;

//   cursor.each(function(err, doc) {
//     assert.equal(err, null);
//     if (doc != null) {
//       resultset.rows[i++] = doc;
//     } else {
//       callback();
//     }
//   });
// };

// var findTask = function(db, taskid, qid, callback) {
//   console.dir(ObjectId(taskid));
//   var cursor = db.collection('tasks').find({_id: ObjectId(taskid)});

//   cursor.each(function(err, doc) {
//     assert.equal(err, null);
//     if (doc != null) {
//       qid.questid = doc.questid.toString();
//       console.log(qid);
//     } else {
//       console.log(qid);
//       callback();
//     }
//   });
// }

var findQuest = function(db, questid, questtitle, questdesc, callback) {
  var cursor = db.collection('quests').find({_id: ObjectId(questid)});

  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      questtitle.title = doc.title;
      questdesc.desc = doc.description;
    } else {
      callback();
    }
  });
}

router.get('/', function(req, res, next) {

  // req.query.questid

  // var resultset = {"rows": []};

  // MongoClient.connect(url, function(err, db) {
  //   assert.equal(null, err);
  //   getTasks(db, resultset, function(){

  //     if (resultset != null) {
  //       res.render("add_tasks",
  //       { tasks: resultset, questid: req.query.questid});
  //     }
  //     db.close();

  //   });
  // });

  // var mid = req.query.id;
  // var mtitle = req.query.title;
  // var mdesc = req.query.desc;
  // var taskid = '55f1831284364ee624d6963b';
  // var qid = {questid: ''};

  // MongoClient.connect(url, function(err, db) {
  //   assert.equal(null, err);
  //   findTask(db, taskid, qid, function(){
  //     console.dir(data);
  //     console.dir(qid);
  //   });
      
  // });

  if(req.query.questid != null && req.query.questid != ''){
    var mtitle = {title: ''}, mdesc = {desc: ''};
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
        // findTask(db, req.query.taskid, qid, function(){
        // console.dir(qid);
      findQuest(db, req.query.questid, mtitle, mdesc, function(){
        db.close();
        console.dir(mtitle.title);
        console.dir(mdesc.desc);
        res.render("add_tasks", {id: req.query.questid, title: mtitle.title, desc: mdesc.desc});
      });
    });
  }else{
    var mid = req.query.id;
    var mtitle = req.query.title;
    var mdesc = req.query.desc;
    res.render("add_tasks", {id: mid, title: mtitle, desc: mdesc});
  }

});

// router.post('/', function(req, res, next) {

//   console.log(req.body.nTaskTitle);
//   console.log(req.body.nTaskDesc);
//   console.log(req.body.nTimerValidator);
//   console.log(req.body.nCheckinValidator);
//   console.log(req.body.nAPIValidator);
//   console.log(req.body.questid);

// });

module.exports = router;