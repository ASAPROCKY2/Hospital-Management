import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081';

export const options = {
    stages: [
        { duration: '30s', target: 40 }, // ramp-up
        { duration: '40s', target: 50 }, // hold
        { duration: '10s', target: 0 },  // ramp-down
    ],
    ext: {
        loadimpact: {
            name: 'Complaint GET Load Test',
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
