var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');

var app = express();

var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, database) {

  if (err) throw err;
  console.log("connected to db");

  db = database;

  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.put("/save", function(request, response) {
  var squareCol = db.collection('square_test');
  squareCol.insertOne(request.body, function(err, r){
    response.send("OK");
  });
})

app.get('/test', function(request, response){
  var testCol = db.collection('square_test');
  var doc = testCol.findOne({_id: new mongodb.ObjectId("594eda91df1f4c04266ac9aa")}, {}, function(err, res){
    response.json(res);
  });
});


