# MY PROCESS
This is how I'm loading data into Postgres (the files were in my downloads folder but I can change the paths)

## Questions
\COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) FROM '/home/ubuntu/questions.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX product_idx ON questions (product_id);

## Answers
\COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) FROM '/home/ubuntu/answers.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX question_idx ON answers (question_id);

## Answers_Photos
\COPY answers_photos(id, answer_id, url) FROM '/home/ubuntu/answers_photos.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX answer_idx ON answers_photos (answer_id);

## Next Steps
run express
connect express paths to database queries



SELECT questions.product_id AS question_id, questions.body AS question_body, questions.date_written AS question_date, questions.asker_name AS asker_name, questions.helpful AS question_helpfulness, questions.reported AS reported,

answers.id AS id, answers.body AS body, answers.date_written AS date, answers.answerer_name AS answerer_name, answers.helpful AS helpfulness,

photos.url AS url

FROM questions
LEFT JOIN answers ON questions.id = answers.question_id
LEFT JOIN answers_photos ON answers.id = answers_photos.answer_id
WHERE questions.product_id = ${product_id};