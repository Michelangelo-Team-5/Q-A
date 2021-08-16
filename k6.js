import http from 'k6/http';
import { sleep } from 'k6';
export let options = {
  vus: 1000,
  duration: '60s'
};

export default function () {
  http.get(`http://localhost:3000/test/${Math.floor(Math.random() * 3518964)}`);
  sleep(1);
}

// export default function () {
//   http.get(`http://localhost:3000/qa/questions?product_id=${Math.floor(Math.random() * 1000011)}`);
//   sleep(1);
// }

// export default function () {
//   http.get(`http://localhost:3000/qa/questions/3500000/answers`);
//   sleep(1);
// }

// product_id
// ${Math.floor(Math.random() * 1000011)}

// questions_id
// 3518964
