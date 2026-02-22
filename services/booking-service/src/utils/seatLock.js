import redisClient from '../config/redis.js';

const LOCK_TTL_SECONDS = 300;

const UNLOCK_SCRIPT = `
  if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
  else
    return 0
  end
`;

const buildKey = (showId, seatNumber) => `seat:lock:${showId}:${seatNumber}`;

export const acquireSeatLock = async (showId, seatNumber, userId) => {
  const key = buildKey(showId, seatNumber);
  const result = await redisClient.set(key, userId, {
    NX: true,
    EX: LOCK_TTL_SECONDS,
  });
  const acquired = result === 'OK';

  if (acquired) {
    console.log(`[SeatLock] ✅ Lock acquired  — key: ${key}  owner: ${userId}`);
  } else {
    const owner = await redisClient.get(key);
    console.log(`[SeatLock] ❌ Lock rejected  — key: ${key}  held by: ${owner}`);
  }

  return acquired;
};

export const releaseSeatLock = async (showId, seatNumber, userId) => {
  const key = buildKey(showId, seatNumber);

  const result = await redisClient.eval(UNLOCK_SCRIPT, {
    keys: [key],
    arguments: [userId],
  });

  if (result === 1) {
    console.log(`[SeatLock] 🔓 Lock released  — key: ${key}  owner: ${userId}`);
    return true;
  } else {
    console.log(`[SeatLock] ⚠️  Release skipped — key: ${key}  (not owner or already expired)`);
    return false;
  }
};

export { buildKey };
