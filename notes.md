# MY PROCESS
This is how I'm loading data into Postgres

## Questions
\COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) FROM '/home/ubuntu/questions.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX product_idx ON questions (product_id);

## Answers
\COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) FROM '/home/ubuntu/answers.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX question_idx ON answers (question_id);

## Answers_Photos
\COPY answers_photos(id, answer_id, url) FROM '/home/ubuntu/answers_photos.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX answer_idx ON answers_photos (answer_id);

k6 run k6.js -> stress testing
new relic...