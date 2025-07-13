import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,        // 1 virtual user
    iterations: 3, 
    duration:'15s'// 1 registration attempt
};

// Helper to generate a random email to avoid duplicates
function randomEmail(): string {
    return `user${Math.floor(Math.random() * 1000000)}@example.com`;
}

export default function () {
    const url = 'http://localhost:8081/auth/register'; // Update if your API runs on a different port

    const payload = JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: randomEmail(),
        password: '111111',
        contactPhone: '0791122634',
        address: 'Nakuru Town',
        role: 'admin'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 201': (r) => r.status === 201,
        'message present': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return typeof body.message === 'string';
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
