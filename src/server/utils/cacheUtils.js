import {loggers} from 'winston';
import crypto from 'crypto';

const CACHE_KEY_PREFIX = 'node-vpcom';
const remoteLog = loggers.get('remote');

export function createCacheWriter(cache, lifetime=86400) {
  return (key, data) => cacheResponse(cache, key, data, lifetime);
}

function cacheResponse(cache, key, data, lifetime=86400) {
  let keyHash = getKeyHash(key);
  const itemKey = `${CACHE_KEY_PREFIX}:${keyHash}`;

  return new Promise((resolve, reject) => {
    cache.set(itemKey, data, lifetime, (err, result) => {
      if (err) {
        remoteLog.warn(`could not write item to cache, reason: ${err.message}`, {itemKey});
        reject(err);
      } else {
        remoteLog.info('wrote item to cache', {itemKey});
        resolve(result);
      }
    });
  });
}

export function responseCache(app) {
  const { memcached } = app.locals;

  return (req, res, next) => {
    let keyHash = getKeyHash(req.originalUrl);
    const itemKey = `${CACHE_KEY_PREFIX}:${keyHash}`;

    remoteLog.debug('getting cached response', {itemKey});

    memcached.get(itemKey, (err, result) => {
      if (err) {
        remoteLog.warn(`could not retrieve item from cache, reason: ${err.message}`, {itemKey});
        next();
      } else if (result) {
        remoteLog.debug('got cached response', {itemKey});
        res.send(JSON.parse(result));
      } else {
        remoteLog.debug('no cached response for key', {itemKey});
        next();
      }
    });

  };
}

function getKeyHash(key) {
  return crypto.createHash('md5').update(key).digest('hex');
}
