var express = require('express');
var fs = require('fs');
const db = require('./db');

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

function setLastReader(readerName, res) {
  var reader = {
    'name' : readerName,
    'date' : formatDate(new Date())
  };
  db.setLastReader(reader, (result) => {
    res.send(result);
  });
}

app.use(express.static(__dirname + '/public'));

// Return who read last and the last reading date.
app.get('/lastReader', function(req, res) {
  db.getLastReader((reader) => {
    res.send(reader);
  });
});

// Set Andy as the last reader today
app.post('/andy', function(req, res) {
  setLastReader('Andy', res);
});

// Set Melissa as the reader today
app.post('/melissa', function(req, res) {
  setLastReader('Melissa', res);
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
  db.getEnglishTranslations((translations) => {
    res.send(translations);
  });
});

// Get the available German translations`
app.get('/translations/german', function(req, res) {
  db.getGermanTranslations((translations) => {
    res.send(translations);
  });
});

app.listen(process.env.PORT || 3000);
