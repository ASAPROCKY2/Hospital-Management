import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMywiZW1haWwiOiJKaW53b29AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUyNDE3NDQ0LCJpYXQiOjE3NTI0MTM4NDR9.let04LB0-UW0gTMajB5rCEVfr8SUbiJFEvXH2ngY_3E';

export const options = {
    stages: [
        { duration: '10s', target: 10 },   // ramp-up
        { duration: '10s', target: 100 },  // spike
        { duration: '20s', target: 100 },  // hold
        { duration: '10s', target: 10 },   // drop
        { duration: '10s', target: 0 },    // ramp-down
    ],
    ext: {
        loadimpact: {
            name: 'Payments GET Spike Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/payments`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`,
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
