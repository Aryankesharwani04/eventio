const redisClient = require('../config/redis');

const LOCK_TTL_SECONDS = 300; 

const buildLockKey = (showId, seatNumber) => `seat:${showId}:${seatNumber}`;

const acquireLock = async (showId, seatNumber, userId) => {
  const key = buildLockKey(showId, seatNumber);

  const result = await redisClient.set(key, userId, {
    NX: true,      
    EX: LOCK_TTL_SECONDS,
  });

  if (result === 'OK') {
    return { acquired: true, ownedBySameUser: false };
  }

  const existingOwner = await redisClient.get(key);
  if (existingOwner === userId) {
    return { acquired: true, ownedBySameUser: true };
  }

  return { acquired: false, ownedBySameUser: false };
};


const releaseLock = async (showId, seatNumber, userId) => {
  const key = buildLockKey(showId, seatNumber);

  const owner = await redisClient.get(key);
  if (owner === userId) {
    await redisClient.del(key);
    console.log(`[SeatLock] Released lock for key: ${key}`);
  } else {
    console.log(`[SeatLock] Lock for ${key} not owned by user ${userId}, skipping release.`);
  }
};
const getLockStatus = async (showId, seatNumber) => {
  const key = buildLockKey(showId, seatNumber);
  const owner = await redisClient.get(key);
  return {
    locked: owner !== null,
    lockedByUserId: owner,
  };
};

module.exports = { acquireLock, releaseLock, getLockStatus, buildLockKey };
