const express = require('express');
const db = require('../database/index.js')
const morgan = require('morgan');
const app = express();
const port = 3000;

app.use(morgan('dev'));

// retrieve a list of questions for a particular product
// REMOVE REPORTED QUESTIONS
app.get('/qa/questions', async (req, res) => {
  let {product_id, page, count} = req.query;
  if (!product_id) {
    res.status(400).send('Error: invalid product_id provided');
  }
  // page default
  if (!page) {
    let page = 1;
  }
  // count default
  if (!count) {
    let count = 5;
  }
  // USE PAGE AND COUNT CONDITIONALLY

  let results = await db.query(`SELECT id as question_id, body as question_body, date_written as question_date, asker_name, helpful as question_helpfulness, reported FROM questions WHERE product_id = ${product_id}`);
  for (var i = 0; i < results.length; i++) {
    let question_id = results[i].question_id;
    let answers = await db.query(`SELECT id, body, date_written as date, answerer_name, helpful as helpfulness FROM answers WHERE question_id = ${question_id}`);
    if (!answers || !answers.length) {
      results[i].answers = {};
      continue;
    }
    answers = answers[0];
    results[i].answers = {}
    results[i].answers[answers.id] = answers;
    let photos = await db.query(`SELECT url FROM answers_photos WHERE answer_id = ${answers.id}`);
    results[i].answers[answers.id].photos = photos.map(i => i.url);
  }
  let response = {product_id, results};
  res.status(200).send(response);
});

// return answers for a given question
// REMOVE REPORTED ANSWERS
app.get('/qa/questions/:question_id', async (req, res) => {
  // USE PAGE AND COUNT CONDITIONALLY

  let question_id = req.params.question_id;
  let response = await db.query(`SELECT * FROM answers WHERE question_id=${question_id}`);
  // debugger;
  res.status(200).send(response);
}) ;

app.listen(port, () => {console.log(`Listening at http://localhost:${port}`)})


// laundry, black masks