const express = require('express');
const db = require('../database/index.js')
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

const something = async () => {
  let x = await db.query('SELECT * FROM questions LIMIT 10');
  debugger;
}

something();