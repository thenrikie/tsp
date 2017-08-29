'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const createRoute = require('./routes/createRoute');
const getRoute = require('./routes/getRoute');
const config = require('config');

const redis = require("redis");
const client = redis.createClient(config.redis);

const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);


app.use(bodyParser.json());

app.post('/route', createRoute);
app.get('/route/:token', getRoute);

client.on("error",err => {
    console.error("Redis Error " + err);
});


// once connected to redis we can start the app
client.on('connect',() => {
	app.listen(3000,() => {
	  console.log('Example app listening on port 3000!')
	});
});
