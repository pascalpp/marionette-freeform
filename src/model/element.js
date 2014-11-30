define(function(require) {
	'use strict';

	require('model/validation');

	var default_options = {
		text: {
			show_label: true,
			show_label_before: true
		},
		textarea: {
			show_label: true,
			show_label_before: true
		},
		checkbox: {
			show_label: true,
			show_label_after: true
		}
	};

	var Element = Backbone.Model.extend({
		defaults: function() {
			return {
				type: null,
				value: null,
				label: null,
				placeholder: null,
				name: this.cid,
				id: this.cid,
				related_key: null,
				related_model: null,
				validator: null,
				error: null,

				// view options
				el: null,
				show_label: null,
				show_label_before: null,
				show_label_after: null,
				label_class: 'label',
				error_class: 'error'
			};
		},

		constructor: function(attrs, options) {
			attrs = attrs || {};
			var defaults = default_options[attrs.type] || {};
			_.defaults(attrs, defaults);
			Backbone.Model.apply(this, [attrs, options]);
		},

		validators: {
			'type': function(type) {
				if (! type) return 'Element requires a type';
			}
		}
	});

	return Element;

});