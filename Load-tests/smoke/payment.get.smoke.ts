import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    iterations: 3,
    duration: '15s',
};

// Replace with your valid admin token
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMywiZW1haWwiOiJKaW53b29AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUyMzk2ODMwLCJpYXQiOjE3NTIzOTMyMzB9.615iUoVwhGgDDa8YMWrcIWNviTQnUfGSb9dQUuNnnz8';

export default function () {
    const url = 'http://localhost:8081/payments';

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response is array': (r) => {
            try {
                const body = typeof r.body === 'string' ? JSON.parse(r.body) : [];
                return Array.isArray(body);
            } catch {
                return false;
            }
        },
        'at least one payment exists': (r) => {
            try {
                const body = typeof r.body === 'string' ? JSON.parse(r.body) : [];
                return body.length > 0;
            } catch {
                return false;
            }
        },
        'payment has required fields': (r) => {
            try {
                const body = typeof r.body === 'string' ? JSON.parse(r.body) : [];
                return body.every((p) =>
                    'payment_id' in p &&
                    'amount' in p &&
                    'payment_status' in p &&
                    'transaction_id' in p &&
                    'appointment' in p &&
                    typeof p.appointment === 'object' &&
                    'appointment_id' in p.appointment &&
                    'appointment_date' in p.appointment
                );
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
