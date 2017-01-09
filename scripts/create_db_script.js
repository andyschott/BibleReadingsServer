#! /usr/bin/env node

const fs = require('fs');

const sqlFormat = "CREATE TABLE IF NOT EXISTS LAST_READER (ID SERIAL PRIMARY KEY, VALUE JSON NOT NULL);\n" +
  "\n" +
  "DROP TABLE IF EXISTS TRANSLATIONS;\n" +
  "CREATE TABLE TRANSLATIONS (ID SERIAL PRIMARY KEY, VALUE JSON NOT NULL);\n" +
  "{0}\n" +
  "\n" + 
  "DROP TABLE IF EXISTS READINGS;\n" +
  "CREATE TABLE READINGS (ID SERIAL PRIMARY KEY, MONTH INTEGER NOT NULL, DAY INTEGER NOT NULL, VALUE JSON NOT NULL);\n" +
  "{1}\n" +
  "\n";

// Read in the translations
const translationFiles = ['english_translations.json', 'german_translations.json'];

var insertTranslationStatements = '';
for(var i = 0; i < translationFiles.length; ++i) {
  const translations = JSON.parse(fs.readFileSync('data/' + translationFiles[i]));
  const insertStmt = 'INSERT INTO TRANSLATIONS (VALUE) VALUES (\'' + JSON.stringify(translations) + '\');';
  insertTranslationStatements = insertTranslationStatements + insertStmt + "\n";
}

// Read in the readings
var insertReadingStatements = '';
for(var i = 1; i <= 12; ++i) {
  const readings = JSON.parse(fs.readFileSync('data/' + i + '.json'));
  for(var j = 1; j < readings.length; ++j) {
    const insertStmt = 'INSERT INTO READINGS (MONTH, DAY, VALUE) VALUES (' +
      i + ', ' +
      j + ', ' +
      "'" + JSON.stringify(readings[j]) + "'" +
      ');';
    insertReadingStatements = insertReadingStatements + insertStmt + "\n";
  }
}

const sql = sqlFormat.replace("{0}", insertTranslationStatements)
  .replace("{1}", insertReadingStatements);

fs.writeFileSync('scripts/create_database.sql', sql);
