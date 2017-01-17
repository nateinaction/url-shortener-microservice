var express = require('express')
var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient

var url = process.env.MongoDB_URI

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);

    // do some work here with the database.

    //Close connection
    db.close();
  }
});

var app = express()

app.listen(process.env.PORT || 5000)
