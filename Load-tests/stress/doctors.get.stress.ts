import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081'; // Adjust the port if needed

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
            name: 'Doctor GET Stress Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/doctor`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const ok = check(res, {
        'status is 200': (r) => r.status === 200,
        'has data array': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return Array.isArray(body.data);
            } catch {
                return false;
            }
        },
    });

    // 
    if (!ok) {
        console.error('❌ Unexpected response detected:', {
            status: res.status,
            body: res.body, // raw response body
        });
    }

    sleep(1);
}
