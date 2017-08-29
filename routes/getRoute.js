'use strict';

const client = require('../redisClient');

function getRoute(req, res, next){

	const token = req.params.token;

	client.getAsync(token).then(value => {

		if(!value){
			return Promise.reject({ httpCode: 404, message: 'Token not found'})
		}

		res.status(200).json(JSON.parse(value));

	}).catch(err => {

		res.status(err.httpCode || 400).json(
			{
				"status": "failure",
				"error": err.message
			}
		);
	})

	
}

module.exports = getRoute;
