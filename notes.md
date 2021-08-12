# MY PROCESS
This is how I'm loading data into Postgres (the files were in my downloads folder but I can change the paths)



## Questions
\COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/Users/bear/Downloads/questions.csv'
DELIMITER ','
CSV HEADER;

## Answers
\COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
FROM '/Users/bear/Downloads/answers.csv'
DELIMITER ','
CSV HEADER;

## Answers_Photos
\COPY answers_photos(id, answer_id, url)
FROM '/Users/bear/Downloads/answers_photos.csv'
DELIMITER ','
CSV HEADER;

## Next Steps
run express
connect express paths to database queries
launch on docker/AWS