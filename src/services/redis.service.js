'use strict';
const { resolve } = require('path');
const redis = require('redis');
const { promisify } = require("util");
const { reservationInventory } = require('../models/repositories/inventory.repo');

const redisClient  = redis.createClient();

const pExpire = promisify(redisClient.pExpire).bind(redisClient);
const setNXAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const reEntryTimes = 10;
  const expireTime = 3000; // lock for 3 seconds

  for (let i = 0; i < reEntryTimes; i++) {
    //create a key, user have this key can make payment
    const result = await setNXAsync(key, expireTime);
    console.log('result', result);
    if(result === 1) {
      //Work with inventory
      const isReservation = await reservationInventory({ productId, quantity, cartId });

      if(isReservation.modifiedCount){
        await pExpire(key, expireTime);
        return key;
      }

      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

  }
}

const releaseLock = async lockedKey => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(lockedKey);
}

module.exports = {
  acquireLock,
  releaseLock
}