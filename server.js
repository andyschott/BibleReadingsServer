const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  db.getEnglishTranslations((english) => {
    db.getGermanTranslations((german) => {
      res.render('index', {
        english: english.translations,
        german: german.translations
      });
    });
  });
});

// Return who read last and the last reading date.
app.get('/lastReader', function(req, res) {
  db.getLastReader((reader) => {
    res.send(reader);
  });
});

// Set who read last and when they read.
app.post('/lastReader', function(req, res) {
  const reader = req.body;
  db.setLastReader(reader, (result) => {
    res.send(result);
  });
});

// Get the reading(s) for a given day
app.get('/reading/:month/:day', function(req, res) {
  db.getReadings(req.params.month, req.params.day, (results) => {
    res.send(results);
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
