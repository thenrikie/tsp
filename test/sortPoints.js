'use strict';

const chai = require("chai");
const expect = require('chai').expect;
const sortPoints = require('../google-map/sortDestinations')._sortPoints;

describe('sortPoints', () => {

	it('should return empty array if no destinations provided', () => {

		const dests = {rows:[], status: 'OK'};

		expect(sortPoints(dests)).to.deep.equal([]);
	});

	it('should return [0] if there is only 1 destination', () => {

		const dests = {
			rows: [{
				elements: [{
					distance: {
						value: 3,
					},
					status: 'OK'
				}]
			}],
			status: 'OK'
		};

		expect(sortPoints(dests)).to.deep.equal([0]);
	});

	it('should sort objects by its distance in asc order (same order)', () => {

		const dests = {
			rows: [{
				elements: [{
					distance: {
						value: 3,
					},
					status: 'OK'
				},
				{
					distance: {
						value: 4,
					},
					status: 'OK'
				},
				{
					distance: {
						value: 5,
					},
					status: 'OK'
				}]
			}],
			status: 'OK'
		};

		expect(sortPoints(dests)).to.deep.equal([0,1,2]);
	});

	it('should sort objects by its distance in asc order (desc order)', () => {

		const dests = {
			rows: [{
				elements: [{
					distance: {
						value: 5,
					},
					status: 'OK'
				},
				{
					distance: {
						value: 4,
					},
					status: 'OK'
				},
				{
					distance: {
						value: 3,
					},
					status: 'OK'
				}]
			}],
			status: 'OK'
		};

		expect(sortPoints(dests)).to.deep.equal([2,1,0]);
	});

	it('should sort objects by its distance in asc order (mixed order)', () => {

		const dests = {
			rows: [{
				elements: [{
					distance: {
						value: 5,
					},
					status: 'OK'
				},
				{
					distance: {
						value: 4,
					},
					status: 'OK'
				},
				{
					distance: {
						value: 6,
					},
					status: 'OK'
				}]
			}],
			status: 'OK'
		};

		expect(sortPoints(dests)).to.deep.equal([1,0,2]);
	});

	it('should throw an error if any of the element is not OK', () => {

		const dests = {
			rows: [{
				elements: [{
					status: 'NOT_FOUND'
				},
				{
					distance: {
						value: 4,
					},
					status: 'OK'
				},
				{
					distance: {
						value: 6,
					},
					status: 'OK'
				}]
			}],
			status: 'OK'
		};

		expect(() => sortPoints(dests)).to.throw().to.deep.equal({ 
			message: 'Some destinations cannot be reached',
			firstElementError: 'NOT_FOUND'
		});
	});


	it('should throw an error there is if any top level error', () => {

		const dests = {
			rows: [],
			status: 'OVER_QUERY_LIMIT'
		};

		expect(() => sortPoints(dests)).to.throw().to.deep.equal({ 
			message: 'Google API Error', 
			googleAPIStatus: 'OVER_QUERY_LIMIT'
		});
	});
});