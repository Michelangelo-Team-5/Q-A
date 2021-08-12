# MY PROCESS
This is how I'm loading data into Postgres (the files were in my downloads folder but I can change the paths)

## Questions
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  body VARCHAR (1000) NOT NULL,
  date_written BIGINT,
  asker_name VARCHAR (60),
  asker_email VARCHAR (60),
  reported INTEGER DEFAULT 0,
  helpful INTEGER DEFAULT 0
);

\COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/Users/bear/Downloads/questions.csv'
DELIMITER ','
CSV HEADER;

## Answers
CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  body VARCHAR (1000) NOT NULL,
  date_written BIGINT,
  answerer_name VARCHAR (60),
  answerer_email VARCHAR (60),
  reported INTEGER DEFAULT 0,
  helpful INTEGER DEFAULT 0,
  FOREIGN KEY(question_id)
    REFERENCES questions(id)
);

\COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
FROM '/Users/bear/Downloads/answers.csv'
DELIMITER ','
CSV HEADER;

## Answers_Photos
CREATE TABLE IF NOT EXISTS answers_photos (
  id SERIAL PRIMARY KEY,
  answer_id INTEGER NOT NULL,
  url VARCHAR (1000),
  FOREIGN KEY(answer_id)
    REFERENCES answers(id)
);

\COPY answers_photos(id, answer_id, url)
FROM '/Users/bear/Downloads/answers_photos.csv'
DELIMITER ','
CSV HEADER;

## Next Steps
run express
connect express paths to database queries
launch on docker/AWS