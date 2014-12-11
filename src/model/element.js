define(function(require) {
	'use strict';

	var Model = require('./model');
	var ElementTypes = require('./element_types');
	var log = require('src/lib/log'); /* jshint ignore: line */


	// Element model constructor, wraps other ElementTypes
	var Element = Model.extend({

		constructor: function(attrs, options) {
			attrs = attrs || {};

			var ElementType = ElementTypes[attrs.type];

			if (! ElementType) throw new Error('Element requires a valid type.');

			return new ElementType(attrs, options);
		}

	});

	return Element;

});