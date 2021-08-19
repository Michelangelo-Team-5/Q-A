require('newrelic');
const express = require('express');
const db = require('../database/index.js')
const morgan = require('morgan');
const app = express();
const port = 3000;
var compression = require('compression')

// app.use(morgan('dev'));
app.use(express.json());
app.use(compression());

// STRUCTURE DATE
// REMOVE REPORTED QUESTIONS
// USE PAGE AND COUNT CONDITIONALLY

// app.get('/qa/questions', async (req, res) => {
//   let {product_id, page = 1, count = 5} = req.query;
//   if (!product_id) {
//     res.status(400).send('Error: invalid product_id provided');
//   }
//   let [results] = await db.query(
//     `SELECT questions.product_id,
//       json_agg(
//         json_build_object(
//           'question_id', questions.id, 'question_body', questions.body, 'question_date', questions.date_written, 'asker_name', questions.asker_name, 'question_helpfulness', questions.helpful, 'reported', questions.reported, 'answers',
//             json_build_object(
//               answers.id, json_build_object(
//               'id', answers.id, 'body', answers.body, 'date', answers.date_written, 'answerer_name', answers.answerer_name, 'helpfulness', answers.helpful, 'photos', (
//                 SELECT json_agg(url) FROM answers_photos
//                 WHERE answers.id = answers_photos.answer_id
//                 )
//             )
//           )
//         )
//       ) AS results FROM questions LEFT JOIN answers ON answers.question_id = questions.id LEFT JOIN answers_photos ON answers.id = answers_photos.answer_id
//   WHERE questions.product_id = ${product_id}
//   GROUP BY questions.product_id;`);
//   res.send(results);
// });

// REMOVE REPORTED QUESTIONS
// USE PAGE AND COUNT CONDITIONALLY
app.get('/qa/questions', async (req, res) => {
  let {product_id, page = 1, count = 5} = req.query;
  if (!product_id) {
    res.status(400).send('Error: invalid product_id provided');
  }
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

app.get('/qa/questions/:question_id/answers', async (req, res) => {
  let { page = 1, count = 5} = req.query;
  let response = { question: req.params.question_id, page, count }
  response.results = await db.query(`SELECT answers.id as answer_id, answers.body, answers.date_written as date, answers.answerer_name, answers.helpful as helpfulness, json_agg(json_build_object('id', answers_photos.id, 'url', answers_photos.url)) AS photos FROM answers LEFT JOIN answers_photos ON answers_photos.answer_id=answers.id WHERE question_id=${req.params.question_id} GROUP BY answers.id`);
  res.send(response);
});

// app.get('/qa/questions/:question_id/answers', async (req, res) => {
//   let {page = 1, count = 5} = req.query;
//   let question = req.params.question_id;
//   let response = {question, page, count}
//   let results = await db.query(`SELECT id as answer_id, body, date_written as date, answerer_name, helpful as helpfulness FROM answers WHERE question_id=${question}`);
//   for (var i = 0; i < results.length; i++) {
//     let photos = await db.query(`SELECT id, url FROM answers_photos WHERE answer_id=${results[i].answer_id}`);
//     results[i].photos = photos
//   }
//   response['results'] = results;
//   res.status(200).send(response);
// });

// add a question for the given product
app.post('/qa/questions', async (req, res) => {
  let {body, name, email, product_id} = req.body;
  if (!body || !name || !email || !product_id) {
    res.status(400).send('Error: Question body contains invalid entries')
  }
  let [{max}] = await db.query(`SELECT MAX(id) from questions`);
  db.none(`INSERT INTO questions(id, product_id, body, date_written, asker_name, asker_email, reported) VALUES($1, $2, $3, $4, $5, $6, $7)`, [max + 1, product_id, body, Date.now(), name, email, false])
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
  let [{max}] = await db.query(`SELECT MAX(id) from answers`);
  db.none(`INSERT INTO answers(id, question_id, body, date_written, answerer_name, answerer_email, reported) VALUES($1, $2, $3, $4, $5, $6, $7)`, [max + 1, question_id, body, Date.now(), name, email, false])
    .then(async () => {
      for (let photo of photos) {
        let photo_id = await db.query(`SELECT MAX(id) from answers_photos`);
        db.none(`INSERT INTO answers_photos(id, answer_id, url) VALUES($1, $2, $3)`, [photo_id[0].max + 1, max + 1, photo])
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