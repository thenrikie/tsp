'use strict';

const chai = require("chai");
const expect = require('chai').expect;
const sortPoints = require('../google-map/sortDestinations')._sortPoints;

describe('sortPoints', () => {

	it('should return empty array if no destinations provided', () => {

		const dests = [];
		expect(sortPoints(dests)).to.deep.equal([]);
	});

	it('should return [0] if there is only 1 destination', () => {

		const dests = [
			{distance: { value: 3 }}
		];
		expect(sortPoints(dests)).to.deep.equal([0]);
	});

	it('should sort objects by its distance in asc order (same order)', () => {

		const dests = [
			{distance: { value: 3 }},
			{distance: { value: 4 }},
			{distance: { value: 5 }},
		];
		expect(sortPoints(dests)).to.deep.equal([0,1,2]);
	});

	it('should sort objects by its distance in asc order (desc order)', () => {

		const dests = [
			{distance: { value: 5 }},
			{distance: { value: 4 }},
			{distance: { value: 3 }},
		];
		expect(sortPoints(dests)).to.deep.equal([2,1,0]);
	});

	it('should sort objects by its distance in asc order (mixed order)', () => {

		const dests = [
			{distance: { value: 5 }},
			{distance: { value: 4 }},
			{distance: { value: 6 }},
		];
		expect(sortPoints(dests)).to.deep.equal([1,0,2]);
	});
});