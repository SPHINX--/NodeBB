'use strict';

var	async = require('async'),
	assert = require('assert'),
	db = require('../mocks/databasemock');

describe('Set methods', function() {

	describe('setAdd()', function() {
		it('should add to a set', function(done) {
			db.setAdd('testSet', 5, function(err) {
				assert.equal(err, null);
				assert.equal(arguments.length, 1, 'arguments.length error');
				done();
			});
		});

		it('should add an array to a set', function(done) {
			db.setAdd('testSet', [1, 2, 3, 4], function(err) {
				assert.equal(err, null);
				assert.equal(arguments.length, 1, 'arguments.length error');
				done();
			});
		});
	});

	describe('getSetMembers()', function() {
		it('should return an empty set', function(done) {
			db.getSetMembers('doesnotexist', function(err, set) {
				assert.equal(err, null);
				assert.equal(arguments.length, 2, 'arguments.length error');
				assert.equal(Array.isArray(set), true, 'set is not an array');
				assert.equal(set.length, 0, 'set not empty');
				done();
			});
		});

		it('should return a set with all elements', function(done) {
			db.getSetMembers('testSet', function(err, set) {
				assert.equal(err, null);
				assert.equal(set.length, 5, 'set is empty');
				set.forEach(function(value) {
					assert.notEqual(['1', '2', '3', '4', '5'].indexOf(value), -1, 'set does not have correct elements');
				});

				done();
			});
		});
	});

	describe('setsAdd()', function() {
		it('should add to multiple sets', function(done) {
			db.setsAdd(['set1', 'set2'], 'value', function(err) {
				assert.equal(err, null);
				assert.equal(arguments.length, 1, 'arguments.length error');
				done();
			});
		});
	});

	describe('getSetsMembers()', function() {
		it('should return members of two sets', function(done) {
			db.getSetsMembers(['set1', 'set2'], function(err, sets) {
				assert.equal(err, null);
				assert.equal(Array.isArray(sets), true, 'sets is not an array');
				assert.equal(arguments.length, 2, 'arguments.length error');
				assert.equal(Array.isArray(sets[0]) && Array.isArray(sets[1]), true, 'sets not arrays');
				assert.strictEqual(sets[0][0], 'value', 'set value not correct');
				assert.strictEqual(sets[1][0], 'value', 'set value not correct');
				done();
			});
		});
	});

	describe('isSetMember()', function() {
		it('should return false if element is not member of set', function(done) {
			db.isSetMember('testSet', 10, function(err, isMember) {
				assert.equal(err, null);
				assert.equal(arguments.length, 2, 'arguments.length error');
				assert.equal(isMember, false);
				done();
			});
		});

		it('should return true if element is a member of set', function(done) {
			db.isSetMember('testSet', 5, function(err, isMember) {
				assert.equal(err, null);
				assert.equal(arguments.length, 2, 'arguments.length error');
				assert.equal(isMember, true);
				done();
			});
		});
	});

	describe('isSetMembers()', function() {
		it('should return an array of booleans', function(done) {
			db.isSetMembers('testSet', ['1', '2', '10', '3'], function(err, members) {
				assert.equal(err, null);
				assert.equal(arguments.length, 2, 'arguments.length error');
				assert.equal(Array.isArray(members), true);
				assert.deepEqual(members, [true, true, false, true]);
				done();
			});
		});
	});

	describe('isMemberOfSets()', function() {
		it('should return an array of booleans', function(done) {
			db.isMemberOfSets(['set1', 'testSet', 'set2', 'doesnotexist'], 'value', function(err, members) {
				assert.equal(err, null);
				assert.equal(arguments.length, 2, 'arguments.length error');
				assert.equal(Array.isArray(members), true);
				assert.deepEqual(members, [true, false, true, false]);
				done();
			});
		});
	});

	describe('setCount()', function() {
		it('should return the element count of set', function(done) {
			db.setCount('testSet', function(err, count) {
				assert.equal(err, null);
				assert.equal(arguments.length, 2, 'arguments.length error');
				assert.strictEqual(count, 5);
				done();
			});
		});
	});

	describe('setsCount()', function() {
		it('should return the element count of sets', function(done) {
			db.setsCount(['testSet', 'set1', 'set2', 'doesnotexist'], function(err, counts) {
				assert.equal(err, null);
				assert.equal(arguments.length, 2, 'arguments.length error');
				assert.equal(Array.isArray(counts), true);
				assert.deepEqual(counts, [5, 1, 1, 0]);
				done();
			});
		});
	});

	describe('setRemove()', function() {
		it('should remove a element from set', function(done) {
			db.setRemove('testSet', '2', function(err) {
				assert.equal(err, null);
				assert.equal(arguments.length, 1, 'arguments.length error');

				db.isSetMember('testSet', '2', function(err, isMember) {
					assert.equal(err, null);
					assert.equal(isMember, false);
					done();
				});
			});
		});
	});

	describe('setsRemove()', function() {
		it('should remove a element from multiple sets', function(done) {
			db.setsRemove(['set1', 'set2'], 'value', function(err) {
				assert.equal(err, null);
				assert.equal(arguments.length, 1, 'arguments.length error');
				db.isMemberOfSets(['set1', 'set2'], 'value', function(err, members) {
					assert.equal(err, null);
					assert.deepEqual(members, [false, false]);
					done();
				});
			});
		});
	});

	describe('setRemoveRandom()', function() {
		it('should remove a random element from set', function(done) {
			db.setRemoveRandom('testSet', function(err, element) {
				assert.equal(err, null);
				assert.equal(arguments.length, 2, 'arguments.length error');

				db.isSetMember('testSet', element, function(err, ismember) {
					assert.equal(err, null);
					assert.equal(ismember, false);
					done();
				});
			});
		});
	});


	after(function() {
		db.flushdb();
	});
});
