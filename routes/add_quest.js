var express = require('express');
var router = express.Router();

// Mongodb var
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/lifeplusdb';
var ObjectId = require('mongodb').ObjectID;

var addQuest = function(db, questtitle, questdesc, subtasks, callback) {
  var col = db.collection('quests');
  var id;
  col.insertOne({
    "title": questtitle, 
    "description": questdesc}, function(err, r) {
    id = r.insertedId;
    console.log(r);
    console.log(id);
    assert.equal(null, err);
    if(subtasks != null && subtasks.length != 0){
      addTasks(db, id, subtasks, callback);
    } else {
      callback();
    }
  });
  // var cursor = db.collection('quests').find({_id : id});
  // if (cursor ==null){
  //   console.log("null");
  // }
  // cursor.each(function(err, doc) {
  //   assert.equal(err, null);
  //   console.log(1);
  // });
  // callback();
}

var addTasks = function(db, questid, subtasks, callback){
  if (db == null || questid == null || subtasks == null || callback == null){
    console.log(db);
    console.log(questid);
    console.log(subtasks);
    console.log(call);
  }

  var objId = new ObjectId(questid);

  var col = db.collection('tasks');
  // parseTaskData(subtasks, objId);

  for (var i = subtasks.length - 1; i >= 0; i--) {
    subtasks[i].questid = objId;
    console.dir(subtasks[i]);
  };

  col.insertMany(subtasks, function(err, r) {
    assert.equal(null, err);
    assert.equal(subtasks.length, r.insertedCount);

    callback();
  });
}

var findQuests = function(db, resultset, callback) {
  var cursor = db.collection('quests').find({});
  var i = 0;

  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      resultset.rows[i] = doc;
      console.dir(doc._id);
      resultset.rows[i].questid = doc._id.toString();
      i++;
    } else {
      callback();
    }
  });
}

var updateQuest = function(db, questid, questtitle, questdesc, subtasks, callback) {
  var col = db.collection('quests');
  col.update({_id: ObjectId(questid)}, {title: questtitle, description: questdesc}, function(err, r) {
    assert.equal(null, err);
    if(subtasks != null && subtasks.length != 0){
      updateTasks(db, questid, subtasks, callback);
    } else {
      callback();
    }
  });
}

var updateTasks = function(db, questid, subtasks, callback){
  if (db == null || questid == null || subtasks == null || callback == null){
    console.log(db);
    console.log(questid);
    console.log(subtasks);
    console.log(callback);
  }

  var cursor = db.collection('tasks').find({questid: ObjectId(questid)});
  var col = db.collection('tasks');
  var i = 0;

  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      var curtask = subtasks[i];
      col.update({_id: doc._id}, {$set: {title: curtask.title, 
        desc: curtask.desc, 
        timer: curtask.timer, 
        checkin: curtask.checkin, 
        api: curtask.api} });
      i++;
    } else {
      if(subtasks.length > i) {
        var newtasks = [];
        for (var j = 0; (i+j) < subtasks.length; j++) {
          newtasks[j] = subtasks[i+j];
          newtasks[j].questid = ObjectId(questid);
        }
        col.insertMany(newtasks, function(err, r) {
          assert.equal(null, err);
          assert.equal(newtasks.length, r.insertedCount);
        });
      }
      callback();
    }
  });
}


  // console.dir(objId);
  // var curser = db.collection('quests').find({_id: objId});
  // console.dir(questid);
  // console.dir(curser);
  // var dataset;
  // curser.each(function(err, doc){
  //   assert.equal(err, null);
  //   dataset = doc;
  //   var i=0, j=0;
  //   if(doc == null){
  //     i++;
  //     console.log("null" + i);
  //   } else {
  //     j++;
  //     console.log("doc" + j );
  //     console.dir(dataset.title);
  //     console.dir(dataset.description);
  //   }
  // });

// var parseTaskData = function(data, parentId) {
//   for (var i = data.length - 1; i >= 0; i--) {
//     data[i].questid = parentId;
//     console.dir(data[i]);
//   };
// }

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

  var subtasks = [];
  console.dir(req.body.relatedTasks);
  if (req.body.relatedTasks != '') {
    subtasks = JSON.parse(req.body.relatedTasks);
  };
  var questtitle = req.body.nQuestTitle;
  var questdesc = req.body.nQuestDesc;
  var questid = req.body.hiddenQuestId;
  
  if (questid != null && questid != 'undefined') {

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      //console.log('questid have:' + questid);
      updateQuest(db, questid, questtitle, questdesc, subtasks, function(){
        var resultset = {"rows": []};
        findQuests(db, resultset, function(){
          db.close();
          res.render('quests_list', {quests: resultset, deleteTmpTasks: 1});
        });
      });
    });

  } else {
    MongoClient.connect(url, function(err, db) {
      console.log('questid have not');
      assert.equal(null, err);
      addQuest(db, questtitle, questdesc, subtasks, function(){
        var resultset = {"rows": []};
        findQuests(db, resultset, function(){
          db.close();
          res.render('quests_list', {quests: resultset, deleteTmpTasks: 1});
        });
      });
    });
  }
});

module.exports = router;