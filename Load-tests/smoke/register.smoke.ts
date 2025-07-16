import http from 'k6/http';
import { check, sleep } from 'k6';

// k6 options: 1 virtual user, run 3 iterations, max duration 15 seconds
export const options = {
  vus: 1,
  iterations: 3,
  duration: '15s',
};

// Helper function to generate a random email so each run is unique
function randomEmail() {
  return `user${Math.floor(Math.random() * 1000000)}@example.com`;
}

export default function () {
  const url = 'http://localhost:8081/auth/register'; // make sure your server is running on this port

  // ✅ Fixed payload: use a valid role ("patient" or "doctor")
  const payload = JSON.stringify({
    firstName: 'Test',
    lastName: 'User',
    email: randomEmail(),
    password: '111111',
    contactPhone: '0791122634',
    address: 'Nakuru Town',
    role: 'doctor', 
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Send the HTTP POST request
  const res = http.post(url, payload, params);

  // Validate response
  check(res, {
    'status is 201': (r) => r.status === 201,
    'message present': (r) => {
      try {
        const body = JSON.parse(r.body as any);
        return typeof body.message === 'string';
      } catch {
        return false;
      }
    },
  });

  // Simulate a short pause between iterations
  sleep(1);
}
