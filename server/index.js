const express = require('express');
const db = require('../database/index.js')
const morgan = require('morgan');
const app = express();
const port = 3000;
var compression = require('compression')

// app.use(morgan('dev'));
app.use(express.json());
app.use(compression());

// HAVE TO STRUCTURE DATE

// retrieve a list of questions for a particular product
// REMOVE REPORTED QUESTIONS
app.get('/qa/questions', async (req, res) => {
  let {product_id, page = 1, count = 5} = req.query;
  if (!product_id) {
    res.status(400).send('Error: invalid product_id provided');
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
  // ADD A 400 RESPONSE IF NO QUESTION_ID IS GIVEN

  // USE PAGE AND COUNT CONDITIONALLY
  let {page = 1, count = 5} = req.query;

  let question = req.params.question_id;
  let response = {question, page, count}
  let results = await db.query(`SELECT id as answer_id, body, date_written as date, answerer_name, helpful as helpfulness FROM answers WHERE question_id=${question}`);
  for (var i = 0; i < results.length; i++) {
    let photos = await db.query(`SELECT id, url FROM answers_photos WHERE answer_id=${results[i].answer_id}`);
    results[i].photos = photos
  }
  response['results'] = results;
  res.status(200).send(response);
});

// add a question for the given product
app.post('/qa/questions', async (req, res) => {
  let {body, name, email, product_id} = req.body;
  if (!body || !name || !email || !product_id) {
    res.status(400).send('Error: Question body contains invalid entries')
  }
  let id = await db.query(`SELECT MAX(id) from questions`);
  db.none(`INSERT INTO questions(id, product_id, body, date_written, asker_name, asker_email, reported) VALUES($1, $2, $3, $4, $5, $6, $7)`, [id[0].max + 1, product_id, body, Date.now(), name, email, false])
    .then(() => {
      res.status(201).send('Created');
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(404);
    })
});

// add an answer for the given question
app.post('/qa/questions/:question_id/answers', async (req, res) => {
  let question_id = req.params.question_id;
  let {body, name, email, photos = []} = req.body;
  if (!body || !name || !email) {
    res.status(400).send('Error: Answer body contains invalid entries')
  }
  let id = await db.query(`SELECT MAX(id) from answers`);
  let answer_id = id[0].max + 1
  db.none(`INSERT INTO answers(id, question_id, body, date_written, answerer_name, answerer_email, reported) VALUES($1, $2, $3, $4, $5, $6, $7)`, [answer_id, question_id, body, Date.now(), name, email, false])
    .then(async () => {
      for (let photo of photos) {
        let photo_id = await db.query(`SELECT MAX(id) from answers_photos`);
        db.none(`INSERT INTO answers_photos(id, answer_id, url) VALUES($1, $2, $3)`, [photo_id[0].max + 1, answer_id, photo])
          .then(() => {})
          .catch(err => {
            console.log(err);
            res.sendStatus(404);
          });
      }
      res.status(201).send('Created');
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(404);
    })
});

// Mark question as helpful
app.put('/qa/questions/:question_id/helpful', async (req, res) => {
  let question_id = req.params.question_id;
  db.none(`UPDATE questions SET helpful = helpful + 1 WHERE id = ${question_id}`)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(404);
    })
});

// Report Question
app.put('/qa/questions/:question_id/report', (req, res) => {
  let question_id = req.params.question_id;
  db.none(`UPDATE questions SET reported = true WHERE id = ${question_id}`)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(404);
    })
});

// Mark answer as helpful
app.put('/qa/answers/:answer_id/helpful', async (req, res) => {
  let answer_id = req.params.answer_id;
  db.none(`UPDATE answers SET helpful = helpful + 1 WHERE id = ${answer_id}`)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(404);
    })
});

// report answer
app.put('/qa/answers/:answer_id/report', (req, res) => {
  let answer_id = req.params.answer_id;
  db.none(`UPDATE answers SET reported = true WHERE id = ${answer_id}`)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(404);
    })
});


app.listen(port, () => {console.log(`Listening at http://localhost:${port}`)})