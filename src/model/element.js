define(function(require) {
	'use strict';

	var Model = require('./model');

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

	var Element = Model.extend({
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

		elementEvents: {
			'change:value': 'onChangeValue'
		},

		constructor: function(attrs, options) {
			attrs = attrs || {};

			var defaults = default_options[attrs.type] || {};
			_.defaults(attrs, defaults);

			if (attrs.type === 'buttonfield') {
				attrs = this.setupButtonfieldAttributes(attrs);
			}

			Backbone.Model.apply(this, [attrs, options]);

			if (! this.isValid({ initializing: true })) {
				throw new Error(this.validationError);
			}

			this.setupRelatedModel();
			this.listenTo(this, 'change:related_model change:related_key', this.setupRelatedModel);

			this.listenTo(this, 'change:value', this.onChangeValue);

			if (this.collection) {
				this.listenTo(this.collection, 'change:related_model', this.setupRelatedModel);
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

		setupRelatedModel: function() {
			// check for a related model
			var related = this.getRelated();
			if (! related) return;

			// stop listening to the previous related model
			if (this.related_model) {
				this.stopListening(this.related_model);
			}

			// assume the related model's value as our own
			var value = related.model.get(related.key);
			this.set('value', value);

			// listen for value changes on the related model
			this.listenTo(related.model, 'change:'+related.key, this.onRelatedModelChange);

			// save a reference so we can stopListening if a new related_model is provided
			this.related_model = related.model;
		},

		onChangeValue: function(model, value, options) {
			if (options.from === 'related') return;
			var invalid = this.validateAttribute('value', value);
			this.set('error', invalid);

			if (! invalid) {
				var related = this.getRelated();
				if (related) {
					related.model.set(related.key, value);
				}
			}
		},

		onRelatedModelChange: function(model, value, options) {
			this.set('value', value, { from: 'related' });
		},

		getRelated: function() {
			var related_model = this.get('related_model') || this.collection && this.collection.related_model;
			var related_key = this.get('related_key');

			if (related_model && related_key) {
				return {
					model: related_model,
					key: related_key
				};
			} else {
				return false;
			}
		},

		validators: {
			'type': function(type) {
				if (! type) throw new Error('Element requires a type.');

				if (type === 'buttonfield') {
					var input = this.get('input');
					var button = this.get('button');
					if (! input || ! button) {
						return 'Buttonfield element requires an input and a button.';
					}
				}
			},
			'related_model': function(related_model) {
				if (! related_model) return;
				if (! (related_model instanceof Backbone.Model)) {
					return 'Related model must be a model.';
				}
			},
			'value': function(value, options) {
				if (options.initializing) return;
				var error;

				// validate against the related model first, if defined
				var related = this.getRelated();
				if (related && related.model.validateAttribute) {
					error = related.model.validateAttribute(related.key, value);
					if (error) return error;
				}

				// validate with model validator
				var validator = this.get('validator');
				if (_.isFunction(validator)) {
					error = validator.call(this, value);
				}
				return error;

			}
		}

	});

	Element.prototype.bindEntityEvents = Marionette.bindEntityEvents;

	return Element;

});