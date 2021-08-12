const express = require('express');
const app = express();
const port = 3000;

// const pgp = require('pg-promise')();
// const db = pgp(connection);


app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})


/* I know how to connect to postgres using psql in the terminal:

psql -U postgres -W -> prompt for password (log-in)
\c questions -> prompt for password (connect to specific database)
run commands in "notes.md" to load csv data
query

how do I create that same connection so that express has access to it?

*/