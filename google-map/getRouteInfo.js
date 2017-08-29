'use strict';

const config = require('config');
const GOOGLE_DIRECTION_API_URL = config.google.directionAPIUrl;
const request = require('request-promise');
const _ = require('lodash');

/** 
 * use google direction API to time and distance info
 * @param {Array} origin - origin in [lat, long]
 * @param {Array} waypoints - array of [lat, long] for intermediate drop off points
 * @param {Array} destination - destionation in [lat, long]
 * @return {Promise} time and distance information { time, distance }
 */
function getRouteInfo(origin, waypoints, destination){
	
	const opts = {
		uri: GOOGLE_DIRECTION_API_URL,
		qs: {
			origin: origin.join(','),
			waypoints: waypoints.map(dest => dest.join(',')).join('|'),
			destination: destination.join(','),
			key: config.google.apiKey
		},
		json: true
	};

	return request(opts).then(data => {
		return _calRouteInfo(data);
	});
}

/** 
 * helper function to calualte total distance and time need for a route
 * @param {Array} data - data return from google api
 * @return {Object}
 */
function _calRouteInfo(data){
	// handle top level error from google api
	if(!data || data.status !== 'OK'){
		throw { message: 'Google API Error', googleAPIStatus: _.get(data, 'status') };
	}

	//use only first route provided by the google api and assume it is the one of the best route
	const legs = _.get(data, 'routes[0].legs');

	if(!Array.isArray(legs) || legs.length === 0){
		throw { message: 'No legs information'}
	}

	return legs.reduce((sum, leg) => {

		sum.distance += leg.distance.value,
		sum.duration += leg.duration.value

		return sum;

	}, { distance: 0, duration: 0});

}

module.exports = { 
	getRouteInfo, 
	_calRouteInfo
};