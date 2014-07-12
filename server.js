var express = require('express');
var fs = require('fs');

var app = express();

var dataFile = 'reader.json';

function formatDate(d) {
  return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " 00:00:00 -0400";
}

// Return who read last and the last reading date.
app.get('/', function(req, res) {
  fs.readFile(dataFile, function(err, data) {
    var reader = {} ;
    if (!err) {
      reader = JSON.parse(data);
    }
    res.send(reader);
  });
});

app.post('/andy', function(req, res) {
  var reader = {
    "name" : "Andy",
    "date" : formatDate(new Date())
  };
  fs.writeFile(dataFile, JSON.stringify(reader), function(err) {
    res.send('OK');
  });
});

app.post('/melissa', function(req, res) {
  var reader = {
    "name" : "Melissa",
    "date" : formatDate(new Date())
  };
  fs.writeFile(dataFile, JSON.stringify(reader), function(err) {
    res.send('OK');
  });
});

app.listen(process.argv[2] || 3000);
