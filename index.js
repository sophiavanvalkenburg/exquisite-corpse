var express = require('express');
var mongodb = require('mongodb');
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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/test', function(request, response){
  var testCol = db.collection('test');
  var doc = testCol.findOne({foo: "bar"}, {}, function(err, res){
    response.json(res);
  });
});


