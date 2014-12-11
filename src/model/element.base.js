define(function(require) {
	'use strict';

	var Marionette = require('marionette');
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
			value: '',
			show_label_after: true,
			checked: false
		},
		radio: {
			show_label_after: true,
			checked: false
		},
		radioset: {
			value: '',
			show_label_before: true
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
		},
		buttonset: {
			show_label_before: false,
			show_label_after: false,
			show_error: false
		}
	};

	var BaseElement = Model.extend({
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

		defaultElementEvents: {
			'change:value': 'validateElement',
			'change:related_model': 'initializeRelatedModel',
			'change:related_key': 'initializeRelatedModel',
		},
		elementEvents: {
			// empty events hash for specific Element types to override
		},

		defaultCollectionEvents: {
			'change:related_model': 'initializeRelatedModel',
		},
		collectionEvents: {
			// empty events hash for specific Element types to override
		},

		bindEntityEvents: Marionette.proxyBindEntityEvents,

		constructor: function(attrs, options) {
			attrs = this.validateConstructor(attrs);

			var defaults = default_options[attrs.type];
			if (defaults) _.defaults(attrs, defaults);

			Model.apply(this, [attrs, options]);

			this.bindEntityEvents(this, this.defaultElementEvents);
			this.bindEntityEvents(this, this.elementEvents);

			if (this.collection) {
				this.bindEntityEvents(this.collection, this.defaultCollectionEvents);
				this.bindEntityEvents(this.collection, this.collectionEvents);
			}

			this.initializeRelatedModel();
			this.initializeElement();
		},

		validateConstructor: function(attrs) {
			// empty attribute validator
			// for specific Element types to override
			return attrs;
		},
		validateRelatedModel: function(related_model) {
			if (! related_model) return;
			if (! (related_model instanceof Backbone.Model)) {
				throw new Error('Related model must be a model.');
			}

			// verify that the related model has per-attribute validation
			// if it doesn't, log an error to the console
			if (! _.isFunction(related_model.validateAttribute)) {
				console.error('Related model doesn’t have a validateAttribute method.');
				console.log('See https://github.com/pascalpp/marionette-freeform/issues/2#issuecomment-65912944');
			}

		},

		initializeElement: function() {
			// empty setup method, called at end of construction
			// for specific Element types to override
		},

		initializeRelatedModel: function() {
			// check for a related model and related key
			var related = this.getRelated();
			if (! related) return;

			this.validateRelatedModel(related.model);

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

		onRelatedModelChange: function(model, value, options) {
			this.set('value', value);
		},

		validateElement: function(model, value, options) {
			var error = this.validateAttribute('value', value);
			this.set('error', error);

			if (! error) {
				var related = this.getRelated();
				if (related) {
					related.model.set(related.key, value);
				}
			}
		},

		validators: {
			'value': function(value, options) {
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

	return BaseElement;

});