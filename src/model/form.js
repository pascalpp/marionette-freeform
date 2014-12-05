define(function(require) {
	'use strict';

	var ElementList = require('./element_list');
	require('./validation');

	var Form = Backbone.Model.extend({

		constructor: function(attrs, options) {
			attrs = attrs || {};
			options = options || {};

			if (_.isArray(attrs.elements)) {
				attrs.elements = new ElementList(attrs.elements);
			}
			if (! (attrs.elements instanceof ElementList)) {
				throw new Error('Form.elements must be an array or an ElementList');
			}

			if (attrs.related_model) attrs.elements.related_model = attrs.related_model;

			Backbone.Model.apply(this, [attrs, options]);
		},

		validators: {
			'elements': function(elements) {
				var invalid = elements.filter(function(element) {
					if (element.get('error')) return element;
				});
				if (invalid.length) return invalid[0].get('error');
			}
		}
	});

	return Form;

});