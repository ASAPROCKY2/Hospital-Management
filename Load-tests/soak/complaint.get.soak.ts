import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081'; // Update if needed

export const options = {
    stages: [
        { duration: '1m', target: 20 },   // ramp-up to 20 users
        { duration: '3m', target: 20 },   // hold at 20 users
        { duration: '40s', target: 0 },   // ramp-down to 0
    ],
    ext: {
        loadimpact: {
            name: 'Complaint GET Soak Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/complaint`, {
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
