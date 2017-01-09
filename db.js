const pg = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/biblereadings';

function connect(callback) {
  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      return {
        'success' : false,
        'data': err
      };
    }

    callback(client, done);
  });
}

function getTranslations(id, callback) {
  connect((client, done) => {
    const query = client.query('SELECT VALUE FROM TRANSLATIONS WHERE ID = $1', [id]);

    const results = [];
    query.on('row', (row) => {
      results.push(row.value);
    });

    query.on('end', () => {
      done();
      callback(results[results.length - 1]);
    });
  });
}

const db = {
  'setLastReader' : function(reader, callback) {
    connect((client, done) => {
      client.query('DELETE FROM LAST_READER');

      const query = client.query('INSERT INTO LAST_READER (VALUE) VALUES ($1)', [JSON.stringify(reader)]);

      query.on('end', () => {
        done();
        callback('OK');
      });
    });
  },

  'getLastReader' : function(callback) {
    connect((client, done) => {
      const query = client.query('SELECT VALUE FROM LAST_READER');

      const results = [];
      query.on('row', (row) => {
        results.push(row.value);
      });

      query.on('end', () => {
        done();

        callback(results[results.length - 1]);
      });
    });
  },

  'getEnglishTranslations' : function(callback) {
    getTranslations(1, callback);
  },

  'getGermanTranslations' : function(callback) {
    getTranslations(2, callback);
  }
};

module.exports = db;
