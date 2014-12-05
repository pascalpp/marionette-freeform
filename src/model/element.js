define(function(require) {
	'use strict';

	require('model/validation');

	var default_options = {
		text: {
			value: '',
			show_label_before: true
		},
		textarea: {
			value: '',
			show_label_before: true
		},
		checkbox: {
			value: false,
			show_label_after: true
		},
		select: {
			value: '',
			show_label_before: true
		},
		buttonfield: {
			value: '',
			show_label_before: true
		},
		submit: {
			show_label_before: false,
			show_label_after: false,
			show_error: false
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
				disabled: false,
				related_key: null,
				related_model: null,
				validator: null,
				error: null,

				// view options
				el: null,
				show_label: true,
				show_error: true,
				show_label_before: null,
				show_label_after: null,
				label_class: 'label',
				error_class: 'error'
			};
		},

		constructor: function(attrs, options) {
			attrs = attrs || {};
			if (! attrs.type) throw new Error('Element requires a type.');

			var defaults = default_options[attrs.type] || {};
			_.defaults(attrs, defaults);
			Backbone.Model.apply(this, [attrs, options]);
		}

	});

	return Element;

});