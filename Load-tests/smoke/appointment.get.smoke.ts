import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    iterations: 3,
    duration: '15s',
};

export default function () {
    const url = 'http://localhost:8081/appointment';

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has data array': (r) => {
            try {
                const body = JSON.parse(typeof r.body === 'string' ? r.body : '');
                return Array.isArray(body.data);
            } catch {
                return false;
            }
        },
        'at least one appointment exists': (r) => {
            try {
                const body = JSON.parse(typeof r.body === 'string' ? r.body : '');
                return body.data.length > 0;
            } catch {
                return false;
            }
        },
        'appointment has required fields': (r) => {
            try {
                const body = JSON.parse(typeof r.body === 'string' ? r.body : '');
                return body.data.every((item: any) =>
                    'appointment_id' in item &&
                    'appointment_date' in item &&
                    'doctor' in item &&
                    'user' in item
                );
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
