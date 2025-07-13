import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    iterations: 3,
    duration: '15s',
};

export default function () {
    const url = 'http://localhost:8081/doctor';

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.get(url, params);

    // Debug output (can remove after confirming it's working)
    console.log('Response body:\n' + res.body);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has data key': (r) => {
            try {
                const body = JSON.parse(typeof r.body === 'string' ? r.body : '');
                return Array.isArray(body.data);
            } catch {
                return false;
            }
        },
        'at least 1 doctor returned': (r) => {
            try {
                const body = JSON.parse(typeof r.body === 'string' ? r.body : '');
                return body.data && body.data.length > 0;
            } catch {
                return false;
            }
        },
        'each entry has specialization field': (r) => {
            try {
                const body = JSON.parse(typeof r.body === 'string' ? r.body : '');
                return body.data.every((doctor) => 'specialization' in doctor);
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
