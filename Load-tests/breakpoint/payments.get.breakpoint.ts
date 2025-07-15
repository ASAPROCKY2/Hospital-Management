import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMywiZW1haWwiOiJKaW53b29AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUyNDIyMjc4LCJpYXQiOjE3NTI0MTg2Nzh9.HiOhHDqtQ9FHHCOeazKl6w6Y82ELX_frdXP4lAHT3lo';

export const options = {
    stages: [
        { duration: '30s', target: 50 },
        { duration: '30s', target: 100 },
        { duration: '30s', target: 200 },
        { duration: '30s', target: 400 },
        { duration: '30s', target: 800 },
        { duration: '30s', target: 1600 },
        { duration: '30s', target: 0 },
    ],
    ext: {
        loadimpact: {
            name: 'Payments GET Breakpoint Test',
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
                        : new TextDecoder().decode(r.body || new Uint8Array())
                );
                return Array.isArray(body) || Array.isArray(body.data);
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
