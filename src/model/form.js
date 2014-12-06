define(function(require) {
	'use strict';

	var ElementList = require('./element_list');
	require('./validation');

	var Form = Backbone.Model.extend({

		constructor: function(attrs, options) {
			attrs = attrs || {};
			options = options || {};

			this.setupElements(attrs);

			Backbone.Model.apply(this, [attrs, options]);
		},

		setupElements: function(attrs) {
			// if elements is already an ElementList
			// make sure models get their initial value from related model, if defined
			if (attrs.elements instanceof ElementList) {
				if (attrs.related_model) {
					attrs.elements.related_model = attrs.related_model;
					attrs.elements.each(function(element) {
						element.getInitialValueFromRelatedModel();
					});
				}

			// if elements is an array
			// convert it to an ElementList, passing the related model, if defined
			} else if (_.isArray(attrs.elements)) {
				var options = {};
				if (attrs.related_model) {
					options.related_model = attrs.related_model;
				}
				attrs.elements = new ElementList(attrs.elements, options);
			}

			// ensure that elements is an ElementList by now
			if (! (attrs.elements instanceof ElementList)) {
				throw new Error('Form.elements must be an array or an ElementList');
			}

			return attrs;
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