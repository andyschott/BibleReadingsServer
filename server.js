var express = require('express');
var fs = require('fs');

var app = express();

var dataFile = 'reader.json';
var englishFile = 'english_translations.json';
var germanFile = 'german_translations.json';

function formatDate(d) {
  return {
    year : d.getFullYear(),
    month : d.getMonth(),
    day : d.getDate()
  };
}

function readTranslations(translationsFilename, callback) {
  var path = 'data/' + translationsFilename;
  fs.readFile(path, function(err, data) {
    var translations = {};
    if(!err) {
      translations = JSON.parse(data);
    }
    callback(translations);
  });
}

app.use(express.static(__dirname + '/public'));

// Return who read last and the last reading date.
app.get('/lastReader', function(req, res) {
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
  var path = "data/" + req.params.month + ".json";
  fs.readFile(path, function(err, data) {
    var readings = JSON.parse(data.toString());
    var readingsForDay = readings[req.params.day];
    res.send(readingsForDay);
  });
});

// Get the available English translations
app.get('/translations/english', function(req, res) {
  readTranslations(englishFile, function(translations) {
    res.send(translations);
  });
});

// Get the available German translations`
app.get('/translations/german', function(req, res) {
  readTranslations(germanFile, function(translations) {
    res.send(translations);
  });
});

app.listen(process.env.port || 3000);
