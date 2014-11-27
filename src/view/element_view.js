define(function(require) {
	'use strict';

	var
	Element				= require('model/element'),
	InputTextView		= require('./input_text_view'),
	ErrorView			= require('./error_view'),
	Template			= require('text!template/element.html');
	require('lib/setPrefixedClassname');

	function log(msg) {
		console.log.apply(console, arguments);
	}


	var input_tags = {
		text: '<input type="text">',
		password: '<input type="password">',
		textarea: '<textarea></textarea>',
		checkbox: '<input type="checkbox">',
		select: '<select></select>',
	};

	var input_selectors = {
		text: 'input[type=text]',
		password: 'input[type=password]',
		textarea: 'textarea',
		checkbox: 'input[type=checkbox]',
		select: 'select',
	};

	var view_types = {
		text: InputTextView,
		password: InputTextView,
		//textarea: TextareaView,
		//checkbox: CheckboxView
	};



	/* parent element view, meant to be subclassed for specific elements */

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
			var related_model = model.get('related_model'),
				related_key = model.get('related_key');
			if (related_model && related_key) {
				this.listenTo(related_model, 'change:'+related_key, this.onRelatedModelChange);
				this.related_model = related_model;
				this.related_key = related_key;
				model.unset('related_model');
				model.unset('related_key');
			}

			// set up render listeners
			this.listenTo(this, 'all', this.onAll);
			this.listenTo(this, 'before:render', this.onBeforeElementRender);
			this.listenTo(this, 'render', this.onElementRender);


			Marionette.LayoutView.call(this, options);

		},
		onAll: function(event_name) {
			log(event_name, arguments);
		},
		onRelatedModelChange: function(model, value, options) {
			this.model.set('value', value);
		},
		templateHelpers: function() {
			log('templateHelpers');

			return {
				cid: this.model.cid,
				input: input_tags[this.type]
			};

		},
		onElementRender: function() {
			this.createInputView();

		},
		createInputView: function() {
			this.addInputToUiHash();
			var InputView = this.getInputView();
			this.input_view = new InputView({
				el: this.ui.input,
				model: this.model,
				key: this.key
			});
			this.input_view.render();
		},
		getInputView: function() {
			var InputView = this.inputView || view_types[this.type];
			if (! InputView) throw new Error('No InputView defined for type ' + this.type);
			return InputView;
		},
		addInputToUiHash: function() {
			this.ui = this.ui || {};
			var selector = input_selectors[this.type];
			if (! selector) throw new Error('No selector defined for ' + this.type);
			this.ui.input = this.$(selector);
		},


		xinitialize: function(options) {
			log('initialize');


			this.model.set('value', this.relatedModel.get(this.key));
			this.listenTo(this.model, 'change:value', this.onChangeValue);
			this.listenTo(this.model, 'change:error', this.onChangeError);

			this.$el.addClass('element').setPrefixedClassname('type', this.type);

			window['el_'+this.type] = this; // DNR

		},
		onBeforeRender: function() {
			log('onBeforeRender');
		},
		onRender: function() {
			log('onRender');
		},
		regions: {
			error_region: '.error-region'
		},

		events: function() {
			return {

			};
		},
		onChangeValue: function(model, value, options) {
			var error = this.validate(value);

			if (error) {
				this.model.set('error', error);
			} else {
				this.model.unset('error');
				this.relatedModel.set(this.key, value);
			}
		},
		validate: function(value) {
			var error = this.relatedModel.validateAttribute(this.key, value);
			if (error) return error;
			var validator = this.model.get('validator');
			if (_.isFunction(validator)) {
				error = validator.call(this, value);
			}
			return error;
		},

		onChangeError: function(model, error, options) {
			if (error) {
				var error_view = new ErrorView({
					cid: this.model.cid,
					error: error
				});
				this.error_region.show(error_view);
				this.$el.addClass('error');
			} else {
				this.error_region.empty();
				this.$el.removeClass('error');
			}
		},

		getElementValue: function() {
			var value;
			switch(this.type) {
				case 'checkbox':
					value = this.ui.element.is(':checked');
					break;
				case 'text':
				case 'password':
				case 'textarea':
				case 'select':
					value = this.ui.element.val();
					break;
				default:
					throw new Error('ElementView has no support for ' + this.type);
			}
			return value;
		},



	});

	return ElementView;

});
