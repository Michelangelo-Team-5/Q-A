/*
psql -U postgres -W -> prompt for password (log-in)
\c questions -> prompt for password (connect to specific database)
run commands in "notes.md" to load csv data
*/

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

// const cn = 'postgres://username:password@host:port/database';
// Creating a new database instance from the connection details:
const db = pgp(cn);
// Exporting the database object for shared use:
module.exports = db;