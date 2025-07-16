import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1, // 1 virtual user
    iterations: 1, // 1 test iteration
    duration: '15s', // test lasts 15 seconds
};

export default function () {
    const url = 'http://localhost:8081/auth/login'; // update if your port or route is different
    const payload = JSON.stringify({
        email: 'asaproc16@gmail.com',
        password: '111111',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has token': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return typeof body.token === 'string';
            } catch {
                return false;
            }
        },
    });

    sleep(1); // pause to simulate realistic behavior
}
