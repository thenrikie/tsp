'use strict';

const redis = require("redis");
const client = redis.createClient();
const uuidv4 = require('uuid/v4');


function createRoute(req, res, next){

	const token = uuidv4();
	const inProgress = JSON.stringify({"status": "in progress"});


	client.setAsync(token, inProgress).then(() => {

		res.status(200).json({ token });

	}).catch(err => {

		res.status(400).json({ error: err.message });

	});

	
}

module.exports = createRoute;
