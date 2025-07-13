import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,             // 1 virtual user
    iterations: 3,      // Run 3 times
    duration: '15s',    // Optional duration
};

export default function () {
    const url = 'http://localhost:8081/users'; // Adjust port/path if necessary

    const params = {
        headers: {
            'Content-Type': 'application/json',
            // Include auth if needed:
            // 'Authorization': `Bearer ${yourToken}`
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has data key': (r) => {
            try {
                const body = typeof r.body === 'string' ? JSON.parse(r.body) : {};
                return Array.isArray(body.data);
            } catch {
                return false;
            }
        },
        'at least 1 user returned': (r) => {
            try {
                const body = typeof r.body === 'string' ? JSON.parse(r.body) : {};
                return body.data && body.data.length > 0;
            } catch {
                return false;
            }
        },
    });

    sleep(1); // simulate user delay
}
