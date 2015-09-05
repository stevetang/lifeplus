var express = require('express');
var router = express.Router();

// Mongodb var
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var url = 'mongodb://localhost:27017/lifeplusdb';
  

  	var col = db.collection('challenge_categories');

  	col.insertMany([{"Name":"Movies", "Desc":"", "Lnk":"list/movies", "Comments": ""}, 
  		{"Name":"Books", "Desc":"", "Lnk":"list/books", "Comments": ""},
  		{"Name":"Food", "Desc":"", "Lnk":"list/food", "Comments": ""},
  		{"Name":"Travel", "Desc":"", "Lnk":"list/travel", "Comments": ""},
  		{"Name":"Other", "Desc":"", "Lnk":"list/other", "Comments": ""}], function(err, r) {
      assert.equal(null, err);
      assert.equal(5, r.insertedCount);
      // Finish up test

	  db.close();

    });

  res.render('dbexecute', { message: 'created Categories' , error: {} });

});

module.exports = router;