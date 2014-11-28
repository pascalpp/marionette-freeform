define(function(require) {
	'use strict';

	var
	Element				= require('model/element'),
	InputTextView		= require('./input_text_view'),
	InputCheckboxView	= require('./input_checkbox_view'),
	ErrorView			= require('./error_view'),
	Template			= require('text!template/element.html'),
	log					= require('lib/log'); /* jshint ignore: line */
	require('lib/setPrefixedClassname');



	var view_types = {
		text: InputTextView,
		password: InputTextView,
		//textarea: TextareaView,
		checkbox: InputCheckboxView
	};


	var ElementView = Marionette.LayoutView.extend({
		tagName: 'fieldset',
		template: _.template(Template),

		constructor: function(options) {
			options = options || {};

			var model = options.model;

			// validate model
			if (! (model instanceof Element)) throw new Error('ElementView requires an Element model');
			if (! model.isValid()) throw new Error(model.validationError);

			// set type
			this.type = model.get('type');

			// setup related model
			var related_model = model.get('related_model') || model.collection.related_model,
				related_key = model.get('related_key');
			if (related_model && related_key) {
				this.listenTo(related_model, 'change:'+related_key, this.onRelatedModelChange);
				this.related_model = related_model;
				this.related_key = related_key;

				// get value from the related model
				model.set('value', related_model.get(related_key));
			}

			// set up render listeners
			this.listenTo(this, 'all', this.onAll);
			this.listenTo(this, 'before:render', this.onBeforeElementRender);
			this.listenTo(this, 'render', this.onElementRender);

			// model listeners
			this.listenTo(model, 'change:value', this.onChangeValue);
			this.listenTo(model, 'change:error', this.onChangeError);

			Marionette.LayoutView.call(this, options);

			window['el_'+this.type] = this; // DNR

		},
		onAll: function(event_name) {
			//log(event_name, arguments);
		},
		onRelatedModelChange: function(model, value, options) {
			this.model.set('value', value);
		},
		onElementRender: function() {
			this.$el.addClass('element').setPrefixedClassname('type', this.type);
			this.createInputView();
		},
		createInputView: function() {
			var InputView = this.getInputView();
			this.input_view = new InputView({
				model: this.model,
				key: this.key
			});
			this.input_region.show(this.input_view);
		},
		getInputView: function() {
			var InputView = this.inputView || view_types[this.type];
			if (! InputView) throw new Error('No InputView defined for type ' + this.type);
			return InputView;
		},


		regions: {
			input_region: '.input-region',
			error_region: '.error-region'
		},

		onChangeValue: function(model, value, options) {
			var error = this.validate(value);

			if (error) {
				this.model.set('error', error);
			} else {
				this.model.unset('error');
				if (this.related_model) this.related_model.set(this.related_key, value);
			}
		},
		validate: function(value) {
			var error;
			if (this.related_model) {
				error = this.related_model.validateAttribute(this.related_key, value);
				if (error) return error;
			}
			var validator = this.model.get('validator');
			if (_.isFunction(validator)) {
				error = validator.call(this, value);
			}
			return error;
		},

		onChangeError: function(model, error, options) {
			if (error) {
				var error_view = new ErrorView({
					for: this.model.get('id'),
					error: error
				});
				this.error_region.show(error_view);
				this.$el.addClass('element-'+this.model.get('error_class'));
			} else {
				this.error_region.empty();
				this.$el.removeClass('element-'+this.model.get('error_class'));
			}
		}

	});

	return ElementView;

});
