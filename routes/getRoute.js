'use strict';

const client = require('../redisClient');

function getRoute(req, res, next){

	const token = req.params.token;

	client.getAsync(token).then(value => {

		if(!value){
			return Promise.reject({ httpCode: 404, message: 'Token not found'})
		}

		const data = JSON.parse(value);
		let httpCode = 200;

		// if status from api is failed make change the http code to 400
		if (data.status === 'failure'){
			httpCode = 400;
		}

		res.status(httpCode).json(data);

	}).catch(err => {

		//404 not found or other internal error
		res.status(err.httpCode || 500).json(
			{
				"status": "failure",
				"error": err.message
			}
		);
	})

	
}

module.exports = getRoute;
