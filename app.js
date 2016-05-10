var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;

/*
  ESTABLISH DATABASE CONNECTION
*/
var dbName = process.env.DB_NAME || 'node-login';
var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
  if (e) {
    console.log(e);
  } else {
    if (process.env.NODE_ENV == 'live') {
      db.authenticate(process.env.DB_USER, process.env.DB_PASS, function(e, res) {
        if (e) {
          console.log('mongo :: error: not authenticated', e);
        }
        else {
          console.log('mongo :: authenticated and connected to database :: "'+dbName+'"');
        }
      });
    } else {

      console.log('mongo :: connected to database :: "'+dbName+'"');

    }
  }
});

app.get('/', function(req, res){

  console.dir(req.query.id);

  var secrets = db.collection('secrets');
  // Clears DB
  secrets.deleteMany({});
  // Insert some documents 
  secrets.insertMany([
      { key: 'br4nd1sh99' }, { 'key': 'br4nd1shAB' }, { 'key': 'br4nd1shYZ' }
  ], function(err, result) {
      // ToDo
  });
  // Find some documents 
  secrets.find({}).toArray(function(err, docs) {
      console.log("Found the following records");
      console.dir(docs);
  });

  res.sendFile(__dirname + '/index.html');

});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
