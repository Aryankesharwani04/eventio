const autocannon = require('autocannon');

async function runLoadTest({ url, method = 'GET', headers = {}, body = null }) {
  console.log(`Starting test for ${url}`);
  
  const instance = autocannon({
    url,
    method,
    headers,
    body,
    connections: 10,
    duration: 60,
  });
  
  autocannon.track(instance, { renderProgressBar: true });
  
  return new Promise((resolve, reject) => {
    instance.on('done', () => {
      console.log(`Load test finished for ${url}`);
      resolve();
    });
    instance.on('error', (err) => {
      console.error(`Error testing ${url}: ${err}`);
      reject(err);
    });
  });
}

async function runTests() {
  const endpoints = [
    // POST endpoint for login
    {
      url: 'http://localhost:4000/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: 'test@example.com', password: 'Test@123' })
    },
    // GET endpoint for bookings
    {
      url: 'http://localhost:4000/api/bookings',
      method: 'GET'
    },
    // POST endpoint for booking a seat
    {
      url: 'http://localhost:4000/api/book',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: 'your-login-user-id', seatNumber: 'A21' })
    },
    // GET endpoint for seat details
    {
      url: 'http://localhost:4000/seats/seat/A12',
      method: 'GET'
    }
  ];

  for (const endpoint of endpoints) {
    await runLoadTest(endpoint);
  }
}

runTests();
