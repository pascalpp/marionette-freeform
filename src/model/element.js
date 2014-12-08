define(function(require) {
	'use strict';

	var Marionette = require('marionette');
	var Model = require('./model');

	if (! window.console) window.console = {
		log: function() {},
		error: function() {}
	};

	// every valid type should have default options defined here
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
		},
		buttonset: {
			show_label_before: false,
			show_label_after: false,
			show_error: false
		}
	};

	// external object for validating Element attributes during construction
	var Attributes = {

		validate: function(attrs) {
			attrs = attrs || {};
			if (! attrs.type) throw new Error('Element requires a type.');

			var defaults = default_options[attrs.type];
			if (! defaults) throw new Error('Element type "'+attrs.type+'" is not valid.');
			_.defaults(attrs, defaults);

			attrs = this.validateButtonfieldAttributes(attrs);
			attrs = this.validateButtonsetAttributes(attrs);
			attrs = this.validateSelectAttributes(attrs);
			attrs = this.validateRelatedModelAttribute(attrs);

			return attrs;
		},

		validateButtonfieldAttributes: function(attrs) {
			if (attrs.type !== 'buttonfield') return attrs;
			if (! attrs.input || ! attrs.button) {
				throw new Error('Buttonfield Element requires an input and a button.');
			}

			// ensure that `input` and `button` are Element models
			if (! (attrs.input instanceof Element)) {
				attrs.input = new Element(attrs.input);
			}
			if (! (attrs.button instanceof Element)) {
				attrs.button = new Element(attrs.button);
			}
			return attrs;
		},

		validateButtonsetAttributes: function(attrs) {
			if (attrs.type !== 'buttonset') return attrs;
			if (! attrs.buttons) throw new Error('Buttonset Element requires a list of buttons.');

			// ensure that `buttons` is an ElementList
			var ElementList = Marionette.FreeForm.ElementList;
			if (_.isArray(attrs.buttons)) {
				attrs.buttons = new ElementList(attrs.buttons);
			}
			if (! (attrs.buttons instanceof ElementList)) {
				throw new Error('Buttonset Element requires a list of buttons.');
			}
			return attrs;
		},

		validateSelectAttributes: function(attrs) {
			if (attrs.type !== 'select') return attrs;
			if (! attrs.values) throw new Error('Select Element requires a list of values.');

			// ensure that `values` is a collection
			if (_.isArray(attrs.values)) {
				attrs.values = new Backbone.Collection(attrs.values);
			}
			if (! (attrs.values instanceof Backbone.Collection)) {
				throw new Error('Select Element requires a list of values.');
			}
			return attrs;
		},

		validateRelatedModelAttribute: function(attrs) {
			if (! attrs.related_model) return attrs;
			if (! (attrs.related_model instanceof Backbone.Model)) {
				throw new Error('Related model must be a model.');
			}
			return attrs;
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
			attrs = Attributes.validate(attrs);

			Backbone.Model.apply(this, [attrs, options]);

			this.setupRelatedModel();
			this.listenTo(this, 'change:related_model change:related_key', this.setupRelatedModel);
			this.listenTo(this, 'change:value', this.onChangeValue);

			if (this.collection) {
				this.listenTo(this.collection, 'change:related_model', this.setupRelatedModel);
			}
		},

		setupRelatedModel: function() {
			// check for a related model and related key
			var related = this.getRelated();
			if (! related) return;

			// stop listening to the previous related model
			if (this.related_model) {
				this.stopListening(this.related_model);
			}

			// verify that the related model has per-attribute validation
			// if it doesn't, log an error to the console
			if (! _.isFunction(related.model.validateAttribute)) {
				console.error('Related model doesn’t have a validateAttribute method.');
				console.error('See https://github.com/pascalpp/marionette-freeform/issues/2#issuecomment-65912944');
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

	return Element;

});