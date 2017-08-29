'use strict';

const redis = require("redis");
const client = redis.createClient();
const uuidv4 = require('uuid/v4');
const sortDestinations = require('../google-map/sortDestinations').sortDestinations;
const getRouteInfo = require('../google-map/getRouteInfo').getRouteInfo;

// accept a route request and create a record in redis

function createRoute(req, res, next){

	const token = uuidv4();
	const inProgress = JSON.stringify({"status": "in progress"});


	client.setAsync(token, inProgress).then(() => {

		//handle the routes async and once the result is coming back put it into redis
		handleRoute(token, req.body);

		//return the token to client once it is saved to redis
		res.status(200).json({ token });

	}).catch(err => {

		res.status(400).json({ error: err.message });

	});
}

// sort the routes and get the total distance and duration
function handleRoute(token, routes){

	const origin = routes[0];
	const destinations = routes.slice(1);
	// the shortest path for outputting
	const outputPath = [origin];

	//sort the order of destinations which produces shortest path
	return sortDestinations(origin, destinations).then(order => {

		//reorder the destinations and put it into outputPath array
		order.forEach(oriIndex => {
			outputPath.push(destinations[oriIndex]);
		});

		//get the total route distance and duration for the shortest path
		return getRouteInfo(
			origin, 
			outputPath.slice(1, outputPath.length - 1), // any drop off points between
			outputPath[outputPath.length - 1] //destination
		);

	}).then(routeInfo => {

		const data = {
			status: "success",
			path: outputPath,
			total_distance: routeInfo.distance,
			total_time: routeInfo.duration
		};

		console.log(data);
		client.setAsync(token, JSON.stringify(data));

	}).catch(err => {
		// if there is any error while getting the result, put it into redis too
		console.log(err);

		const error = JSON.stringify({
			status: 'failure',
			error: err.message
		});

		client.setAsync(token, error);
	});
}

module.exports = createRoute;
