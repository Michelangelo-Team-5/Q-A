const pgp = require('pg-promise')();
const password = require('../password.js').password;

// Preparing the connection details:
const cn = {
  host: 'localhost',
  port: 5432,
  database: 'questions',
  user: 'postgres',
  password: `${password}`
};
// Creating a new database instance from the connection details:
const db = pgp(cn);

module.exports = db;

// Pooling connections?

/* Scripts to Automate creation of database/seeding of data
psql -U postgres -W -> prompt for password (log-in)
\c questions -> prompt for password (connect to specific database)
run commands in "notes.md" to load csv data
*/