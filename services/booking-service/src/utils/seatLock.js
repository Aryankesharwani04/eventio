const redisClient = require('../config/redis');

const LOCK_TTL_SECONDS = 300; // 5-minute TTL — auto-releases if client crashes

/**
 * Build the Redis key for a seat lock.
 * Format: seat:lock:{showId}:{seatNumber}
 */
const buildKey = (showId, seatNumber) => `seat:lock:${showId}:${seatNumber}`;

/**
 * Acquire a distributed seat lock.
 * Uses SET NX EX — atomic, only succeeds if key does not already exist.
 *
 * @param {string} showId
 * @param {string} seatNumber
 * @param {string} userId  — stored as lock value for future ownership checks (Phase 2)
 * @returns {boolean}  true = lock acquired, false = already locked
 */
const acquireSeatLock = async (showId, seatNumber, userId) => {
  const key = buildKey(showId, seatNumber);
  const result = await redisClient.set(key, userId, {
    NX: true,             // Only set if Not eXists
    EX: LOCK_TTL_SECONDS, // Auto-expire after 5 minutes
  });
  return result === 'OK';
};

/**
 * Release a seat lock.
 * Simple DEL — Phase 2 will add ownership check before deleting.
 *
 * @param {string} showId
 * @param {string} seatNumber
 */
const releaseSeatLock = async (showId, seatNumber) => {
  const key = buildKey(showId, seatNumber);
  await redisClient.del(key);
};

module.exports = { acquireSeatLock, releaseSeatLock, buildKey };
