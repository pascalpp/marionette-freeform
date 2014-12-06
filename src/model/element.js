define(function(require) {
	'use strict';

	require('./validation');

	var default_options = {
		text: {
			value: '',
			show_label_before: true
		},
		password: {
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
			label: 'Submit',
			show_label_before: false,
			show_label_after: false,
			show_error: false
		},
		reset: {
			label: 'Reset',
			show_label_before: false,
			show_label_after: false,
			show_error: false
		},
		button: {
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

			var defaults = default_options[attrs.type] || {};
			_.defaults(attrs, defaults);

			if (attrs.type === 'buttonfield') {
				attrs = this.setupButtonfieldAttributes(attrs);
			}

			Backbone.Model.apply(this, [attrs, options]);

			if (! this.isValid()) {
				throw new Error(this.validationError);
			}
		},

		setupButtonfieldAttributes: function(attrs) {
			if (! (attrs.input instanceof Element)) {
				attrs.input = new Element(attrs.input);
			}
			if (! (attrs.button instanceof Element)) {
				attrs.button = new Element(attrs.button);
			}
			return attrs;
		},

		validators: {
			'type': function(type) {
				if (! type) throw new Error('Element requires a type.');

				if (type === 'buttonfield') {
					var input = this.get('input');
					var button = this.get('button');
					if (! input || ! button) {
						return 'Buttonfield element requires an input and a button.'
					}
				}

			}
		}

	});

	return Element;

});