import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081';
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJlbWFpbCI6ImFzYXByb2MxNkBnbWFpbC5jb20iLCJyb2xlIjoiZG9jdG9yIiwiZXhwIjoxNzUyNjYzODc0LCJpYXQiOjE3NTI2NjAyNzR9._Kfxx9qYnBBQNJT9u8jPI95HIoSNdklh1DGaK54oWAs';

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // ramp-up to 20 users
    { duration: '30s', target: 100 },  // ramp-up to 100 users
    { duration: '30s', target: 200 },  // ramp-up to 200 users
    { duration: '1m', target: 300 },   // spike to 300 users
    { duration: '30s', target: 0 },    // ramp-down to 0 users
  ],
  ext: {
    loadimpact: {
      name: 'Payments GET Stress Test',
    },
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/payments`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'has data array': (r) => {
      try {
        const body = JSON.parse(
          typeof r.body === 'string'
            ? r.body
            : r.body
            ? new TextDecoder().decode(r.body)
            : '{}'
        );
        return Array.isArray(body) || Array.isArray(body.data);
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
