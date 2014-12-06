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

			this.listenTo(this, 'change:related_model', this.onChangeRelatedModel);
		},

		setupElements: function(attrs) {
			// if elements is an array
			// convert it to an ElementList, passing the related model, if defined
			if (_.isArray(attrs.elements)) {
				attrs.elements = new ElementList(attrs.elements);
			}

			// ensure that elements is an ElementList
			if (! (attrs.elements instanceof ElementList)) {
				throw new Error('Form.elements must be an array or an ElementList');
			}

			if (attrs.related_model) {
				attrs.elements.setRelatedModel(attrs.related_model);
			}

			return attrs;
		},

		onChangeRelatedModel: function(model, related_model, options) {
			this.get('elements').setRelatedModel(related_model);
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