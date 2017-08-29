'use strict';

const chai = require("chai");
const expect = require('chai').expect;
const calRouteInfo = require('../google-map/getRouteInfo')._calRouteInfo;

describe('calRouteInfo', () => {

	it('should return object with correct distance and time info if one leg info is provided', () => {

		const dests = {
			routes: [{
				legs:[
					{
						distance: { value: 300 },
						duration: { value: 20 }
					}
				]
			}],
			status: 'OK'
		};

		expect(calRouteInfo(dests)).to.deep.equal({ distance: 300, duration: 20});

	});

	it('should return object with correct distance and time info if more than one legs are provided', () => {

		const dests = {
			routes: [{
				legs:[
					{
						distance: { value: 300 },
						duration: { value: 20 }
					},
					{
						distance: { value: 100 },
						duration: { value: 10 }
					},
					{
						distance: { value: 222 },
						duration: { value: 77 }
					}
				],
			}],
			status: 'OK'
		};
		
		expect(calRouteInfo(dests)).to.deep.equal({ distance: 622, duration: 107});

	});

	it('should throw an error there is if any top level error', () => {

		const dests = {
			status: 'OVER_QUERY_LIMIT'
		};

		expect(() => calRouteInfo(dests)).to.throw().to.deep.equal({ 
			message: 'Google API Error', 
			googleAPIStatus: 'OVER_QUERY_LIMIT'
		});
	});

	it('should throw an error if no destinations provided', () => {

		const dests = {routes:[{legs:[]}], status: 'OK'};

		expect(() => calRouteInfo(dests)).to.throw().to.deep.equal({ 
			message: 'No legs information', 
		});

	});
});

