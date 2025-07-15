import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081';

export const options = {
    stages: [
        { duration: '10s', target: 10 },   // quick ramp-up to 10 users
        { duration: '10s', target: 100 },  // sudden spike to 100 users
        { duration: '20s', target: 100 },  // hold at 100 users
        { duration: '10s', target: 10 },   // sudden drop back to 10 users
        { duration: '10s', target: 0 },    // ramp-down to 0
    ],
    ext: {
        loadimpact: {
            name: 'Appointment GET Spike Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/appointment`, {
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
