import http from 'k6/http';
import { sleep } from 'k6';
export let options = {
  vus: 500,
  duration: '30s'
};

// QUESTIONS
// export default function () {
//   http.get(`http://localhost:3000/qa/questions?product_id=900000`);
//   sleep(1);
// }
export default function () {
  http.get(`http://localhost:3000/qa/questions?product_id=${Math.floor(999000 + Math.random() * (1000011 - 999000))}`);
  sleep(1);
}

// ${Math.floor(Math.random() * 1000011)}

// export default function () {
//   http.get(`http://localhost:3000/qa/questions/3500000/answers`);
//   sleep(1);
// }

// product_id
// ${Math.floor(Math.random() * 1000011)}

// questions_id
// 3518964
