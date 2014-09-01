var express = require('express');
var fs = require('fs');

var app = express();

var dataFile = 'reader.json';

function formatDate(d) {
  return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " 00:00:00 -0400";
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

// Set Andy as the last reader today
app.post('/andy', function(req, res) {
  var reader = {
    "name" : "Andy",
    "date" : formatDate(new Date())
  };
  fs.writeFile(dataFile, JSON.stringify(reader), function(err) {
    res.send('OK');
  });
});

// Set Melissa as the reader today
app.post('/melissa', function(req, res) {
  var reader = {
    "name" : "Melissa",
    "date" : formatDate(new Date())
  };
  fs.writeFile(dataFile, JSON.stringify(reader), function(err) {
    res.send('OK');
  });
});

// Get the reading(s) for a given day
app.get('/reading/:month/:day', function(req, res) {
  res.send("Returning readings for month " + req.params.month + " and day " + req.params.day + ".");
});

app.listen(process.argv[2] || 3000);
