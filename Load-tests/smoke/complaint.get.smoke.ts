import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    iterations: 3,
    duration: '15s',
};

export default function () {
    const url = 'http://localhost:8081/complaint';

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response is array': (r) => {
            try {
                const body = JSON.parse(typeof r.body === 'string' ? r.body : '');
                return Array.isArray(body);
            } catch {
                return false;
            }
        },
        'at least one complaint exists': (r) => {
            try {
                const body = JSON.parse(typeof r.body === 'string' ? r.body : '');
                return Array.isArray(body) && body.length > 0;
            } catch {
                return false;
            }
        },
        'complaint has required fields': (r) => {
            try {
                const body = JSON.parse(typeof r.body === 'string' ? r.body : '');
                return body.every((item) =>
                    'complaint_id' in item &&
                    'user_id' in item &&
                    'subject' in item &&
                    'description' in item &&
                    'created_at' in item
                );
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
