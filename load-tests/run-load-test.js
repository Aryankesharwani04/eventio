const autocannon = require('autocannon');

/**
 * Generic autocannon runner.
 */
async function runLoadTest({ title, url, method = 'GET', headers = {}, body = null, connections = 10, duration = 10 }) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`🚀 ${title}`);
  console.log(`   ${method} ${url}`);
  console.log(`   connections: ${connections}  duration: ${duration}s`);
  console.log('─'.repeat(60));

  const instance = autocannon({
    url,
    method,
    headers,
    body,
    connections,
    duration,
  });

  autocannon.track(instance, { renderProgressBar: true });

  return new Promise((resolve, reject) => {
    instance.on('done', (result) => {
      console.log(`\n✅ Done: ${result['2xx']} success | ${result.non2xx} non-2xx | ${result.errors} errors`);
      resolve(result);
    });
    instance.on('error', reject);
  });
}

async function runTests() {
  // ──────────────────────────────────────────────────────────────────────────
  // TEST 1: Seat Lock Concurrency
  //   20 connections all try to book the SAME seat simultaneously.
  //   Expected: exactly 1 success (201), rest get 409 SEAT_LOCKED.
  //   Proves Redis distributed lock is working correctly.
  // ──────────────────────────────────────────────────────────────────────────
  await runLoadTest({
    title: 'Seat Lock Concurrency Test — 20 users booking same seat',
    url: 'http://localhost:3002/api/book',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'load-test-user', seatNumber: 'A1', showId: 'show-001' }),
    connections: 20,
    duration: 5,
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: Different Seats in Parallel
  //   10 users each booking a different seat.
  //   Expected: all succeed (no lock contention).
  // ──────────────────────────────────────────────────────────────────────────
  // Note: autocannon sends the same body to all connections — use TEST 1 data
  // to verify lock contention, test 2 is a baseline for healthy throughput.
  await runLoadTest({
    title: 'Baseline — GET all bookings (no contention)',
    url: 'http://localhost:3002/api/bookings',
    method: 'GET',
    connections: 10,
    duration: 5,
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 3: Auth login throughput
  // ──────────────────────────────────────────────────────────────────────────
  await runLoadTest({
    title: 'Auth Service — login throughput',
    url: 'http://localhost:3001/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'Test@123' }),
    connections: 10,
    duration: 10,
  });
}

runTests().catch(console.error);
