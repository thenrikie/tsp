'use strict';

const GOOGLE_DISTANCE_API_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json';
const request = require('request-promise');
const _ = require('lodash');

/** 
 * use google distance matrix to get distance and then sort dests by distance
 * @param {Array} origin - origin in [lat, long]
 * @param {Array} destinations - array of destionations in [lat, long]
 * @return {Promise} order of destinations visitng for shortest distance
 */

function sortDestinations(origin, destinations){
	
	const opts = {
		uri: GOOGLE_DISTANCE_API_URL,
		qs: {
			origins: origin.join(','),
			destinations: destinations.map(dest => dest.join(',')).join('|')
		},
		json: true
	};

	return request(opts).then(data => {
		return _sortPoints(data);
	});
}

/** 
 * helper function to sort destinations 
 * @param {Array} data - data return from google api
 * @return {Array} order of destinations visitng for shortest distance
 */

function _sortPoints(data){

	// handle top level error from google api
	if(!data || data.status !== 'OK'){
		throw { message: 'Google API Error', googleAPIStatus: _.get(data, 'status') };
	}

	// make sure data.rows[0].elements exists
	const elements = _.get(data, 'rows[0].elements', []);

	// throw error if there any of the status is not OK
	const firstError = elements.find(e => e.status !== 'OK');
	if(firstError){
		throw { message: 'Some destinations cannot be reached', firstElementError: firstError.status }
	}

	// make an array of { oriIndex, distance } and sort it by distance
	let sortedDests = elements.map((value, index) => {
		return {
			orgIndex: index,
			distance: value.distance.value
		}
	});

	sortedDests = sortedDests.sort((a, b) => a.distance - b.distance);

	//return optimized order of destinations for visiting
	return sortedDests.map(dest => dest.orgIndex);
}

module.exports = {
	sortDestinations,
	// export for unit testing
	_sortPoints
};