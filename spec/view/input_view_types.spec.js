/* global describe, it, expect */
/* jshint expr: true */
define(function(require) {
	'use strict';

	var InputViewTypes = require('src/view/input_view_types');
	var elements = require('spec/helpers/element_types');

	describe('InputViewTypes', function() {

		it('should have the same number of items as elements test helper', function() {
			expect(_.keys(InputViewTypes).length).to.equal(elements.types.length);
		});
		it('should have a view for every type', function() {
			_.each(elements.types, function(type) {
				expect(InputViewTypes[type]).to.exist;
			});
		});

	});

});
