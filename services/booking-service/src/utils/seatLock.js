const redisClient = require('../config/redis');

const LOCK_TTL_SECONDS = 300; // 5-minute TTL — auto-releases if client crashes

/**
 * Lua script for atomic check-and-delete.
 * Only deletes the key if its current value matches the requesting userId.
 * Runs atomically inside Redis — no race window between GET and DEL.
 *
 * Returns: 1 if deleted (owned by caller), 0 if skipped (not owner / already expired)
 */
const UNLOCK_SCRIPT = `
  if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
  else
    return 0
  end
`;

/**
 * Build the Redis key for a seat lock.
 * Format: seat:lock:{showId}:{seatNumber}
 */
const buildKey = (showId, seatNumber) => `seat:lock:${showId}:${seatNumber}`;

/**
 * Acquire a distributed seat lock.
 * Uses SET NX EX — atomic, only succeeds if key does not already exist.
 * Stores userId as the value so ownership can be verified on release.
 *
 * @param {string} showId
 * @param {string} seatNumber
 * @param {string} userId
 * @returns {boolean}  true = lock acquired, false = already locked by someone else
 */
const acquireSeatLock = async (showId, seatNumber, userId) => {
  const key = buildKey(showId, seatNumber);
  const result = await redisClient.set(key, userId, {
    NX: true,             // Only set if Not eXists
    EX: LOCK_TTL_SECONDS, // Auto-expire after 5 minutes
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

/**
 * Safely release a seat lock using an atomic Lua script.
 * Only deletes the key if the current value matches userId.
 * This prevents a late-running DEL from wiping a lock re-acquired by another user
 * after TTL expiry.
 *
 * @param {string} showId
 * @param {string} seatNumber
 * @param {string} userId  — must match the value stored at lock time
 * @returns {boolean}  true if lock released, false if not owner (skipped)
 */
const releaseSeatLock = async (showId, seatNumber, userId) => {
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

module.exports = { acquireSeatLock, releaseSeatLock, buildKey };
