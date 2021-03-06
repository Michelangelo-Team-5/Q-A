-- DROP DATABASE questions;

-- CREATE DATABASE questions;

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  body VARCHAR (1000) NOT NULL,
  date_written BIGINT,
  asker_name VARCHAR (60),
  asker_email VARCHAR (60),
  reported BOOLEAN,
  helpful INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  body VARCHAR (1000) NOT NULL,
  date_written BIGINT,
  answerer_name VARCHAR (60),
  answerer_email VARCHAR (60),
  reported BOOLEAN,
  helpful INTEGER DEFAULT 0,
  FOREIGN KEY(question_id)
    REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS answers_photos (
  id SERIAL PRIMARY KEY,
  answer_id INTEGER NOT NULL,
  url VARCHAR (1000),
  FOREIGN KEY(answer_id)
    REFERENCES answers(id)
);

-- run from root directory
-- sudo -u postgres psql < server/schema.sql
-- psql -U erinoconnor overview < features.sql idk what this is about
-- psql -U postgres; \c questions; DROP TABLE questions, answers, answers_photos;