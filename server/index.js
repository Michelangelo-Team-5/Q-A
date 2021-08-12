const express = require('express');
const db = require('../database/index.js')
const app = express();
const port = 3000;

app.get('/qa/questions', async (req, res) => {
  // can accept product_id, page, count
  let x = await db.query('SELECT * FROM questions LIMIT 10');
  // debugger;
  res.send(x)
});

app.listen(port, () => {console.log(`Listening at http://localhost:${port}`)})
