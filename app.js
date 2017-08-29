'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const createRoute = require('./routes/createRoute');
const getRoute = require('./routes/getRoute');
const config = require('config');
const client = require('./redisClient');

app.use(bodyParser.json());

app.post('/route', createRoute);
app.get('/route/:token', getRoute);

client.on('error', err => {
    console.error("Redis Error " + err);
});


// once connected to redis we can start the app
client.on('connect',() => {
	app.listen(config.web.port, () => {
	  console.log(`Example app listening on port ${config.web.port}!`)
	});
});

// any other error
app.use(function (err, req, res, next) {
	console.log(err)
	res.status(500).json({ error: err.message })
});