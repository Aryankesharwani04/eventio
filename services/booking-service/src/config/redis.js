const { createClient } = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const client = createClient({ url: REDIS_URL });

client.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message);
});

client.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

// Connect immediately on module load
client.connect().catch((err) => {
  console.error('[Redis] Failed to connect on startup:', err.message);
});

module.exports = client;
