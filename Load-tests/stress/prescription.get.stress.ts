import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081'; // Update if needed

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
            name: 'Prescriptions GET Stress Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/prescriptions`, {
        headers: {
            'Content-Type': 'application/json',
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
                        : ''
                );
                return Array.isArray(body.data) || Array.isArray(body);
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
