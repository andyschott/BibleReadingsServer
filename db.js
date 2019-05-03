const { Pool, Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/biblereadings';

function connect() {
  return new Pool({
    connectionString: connectionString,
  });
}

function getTranslations(id, callback) {
  const pool = connect();

  pool.query('SELECT VALUE FROM TRANSLATIONS WHERE ID = $1', [id], (err, res) => {
    pool.end();
    callback(res.rows[res.rowCount - 1].value);
  });
}

const db = {
  'setLastReader' : function(reader, callback) {
    var pool = connect();

    pool.query('DELETE FROM LAST_READER', (err, res) => {
      pool.query('INSERT INTO LAST_READER (VALUE) VALUES ($1)', [JSON.stringify(reader)], (err, res) => {
        pool.end();
        callback('OK');
      });
    });
  },

  'getLastReader' : function(callback) {
    var pool = connect();
    pool.query('SELECT VALUE FROM LAST_READER', (err, res) => {
      pool.end();
      callback(res.rows[res.rowCount - 1].value);
    });
  },

  'getEnglishTranslations' : function(callback) {
    getTranslations(1, callback);
  },

  'getGermanTranslations' : function(callback) {
    getTranslations(2, callback);
  },

  'getReadings' : function(month, day, callback) {
    var pool = connect();

    pool.query('SELECT VALUE FROM READINGS WHERE MONTH = $1 AND DAY = $2', [month, day], (err, res) => {
      pool.end();
      callback(res.rows[res.rowCount - 1].value);
    });
  }
};

module.exports = db;
