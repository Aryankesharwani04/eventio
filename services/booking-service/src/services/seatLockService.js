const redisClient = require('../config/redis');

const LOCK_TTL_SECONDS = 300; // 5 minutes

/**
 * Build the Redis lock key for a given showId + seatNumber.
 * Key format: seat:{showId}:{seatNumber}
 */
const buildLockKey = (showId, seatNumber) => `seat:${showId}:${seatNumber}`;

/**
 * Acquire a distributed seat lock using SET NX EX.
 *
 * @param {string} showId       - Show / event identifier
 * @param {string} seatNumber   - Seat identifier
 * @param {string} userId       - User claiming the seat
 * @returns {{ acquired: boolean, ownedBySameUser: boolean }}
 */
const acquireLock = async (showId, seatNumber, userId) => {
  const key = buildLockKey(showId, seatNumber);

  // SET key userId NX EX 300  →  returns "OK" on success, null if key already exists
  const result = await redisClient.set(key, userId, {
    NX: true,      // Only set if Not eXists
    EX: LOCK_TTL_SECONDS,
  });

  if (result === 'OK') {
    // Lock acquired by this user
    return { acquired: true, ownedBySameUser: false };
  }

  // Lock exists — check if it belongs to the same user (allow idempotent retry)
  const existingOwner = await redisClient.get(key);
  if (existingOwner === userId) {
    return { acquired: true, ownedBySameUser: true };
  }

  // Locked by a different user
  return { acquired: false, ownedBySameUser: false };
};

/**
 * Release the distributed seat lock.
 * Only deletes if the calling user still owns the lock (prevents accidental release
 * after TTL expiry and re-acquisition by another user).
 *
 * @param {string} showId
 * @param {string} seatNumber
 * @param {string} userId
 */
const releaseLock = async (showId, seatNumber, userId) => {
  const key = buildLockKey(showId, seatNumber);

  const owner = await redisClient.get(key);
  if (owner === userId) {
    await redisClient.del(key);
    console.log(`[SeatLock] Released lock for key: ${key}`);
  } else {
    // Lock has already expired or been claimed by someone else — safe to ignore
    console.log(`[SeatLock] Lock for ${key} not owned by user ${userId}, skipping release.`);
  }
};

/**
 * Check whether a seat is currently locked (by anyone).
 *
 * @param {string} showId
 * @param {string} seatNumber
 * @returns {{ locked: boolean, lockedByUserId: string|null }}
 */
const getLockStatus = async (showId, seatNumber) => {
  const key = buildLockKey(showId, seatNumber);
  const owner = await redisClient.get(key);
  return {
    locked: owner !== null,
    lockedByUserId: owner,
  };
};

module.exports = { acquireLock, releaseLock, getLockStatus, buildLockKey };
