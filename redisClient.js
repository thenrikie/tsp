'use strict';

const redis = require('redis');
const config = require('config');
const client = redis.createClient(config.redis);

const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = client;