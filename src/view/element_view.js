define(function(require) {
	'use strict';

	/* MODULE DEPENDENCIES */
	var
	Marionette			= require('marionette'),
	TextfieldView		= require('./textfield_view'),
	TextareaView		= require('./textarea_view'),
	CheckboxView		= require('./checkbox_view'),
	ErrorView			= require('./error_view'),
	Template			= require('text!./element.html'),
	Log					= require('log');
	require('setPrefixedClassname');

	Log.module('lib/form/element_view');
	var log = Log.create('form', 'element', '#eeeeee');

	/**
	@todo
	-
	*/

	var element_tags = {
		text: '<input type="text">',
		password: '<input type="password">',
		textarea: '<textarea></textarea>',
		checkbox: '<input type="checkbox">',
		select: '<select></select>',
	};

	var element_selectors = {
		text: 'input[type=text]',
		password: 'input[type=password]',
		textarea: 'textarea',
		checkbox: 'input[type=checkbox]',
		select: 'select',
	};

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

	var view_types = {
		text: TextfieldView,
		textarea: TextareaView,
		checkbox: CheckboxView
	};



	/* parent element view, meant to be subclassed for specific elements */

	var ElementView = Marionette.LayoutView.extend({
		tagName: 'fieldset',
		template: _.template(Template),

		initialize: function(options) {
			log('initialize');

			if (! this.options.model) throw new Error('ElementView requires a model');
			if (! this.options.key) throw new Error('ElementView requires a model key');
			if (! this.options.type) throw new Error('ElementView requires a type');

			this.relatedModel = this.options.model;
			this.key = this.options.key;
			this.type = this.options.type;
			delete this.options.model;
			delete this.options.key;
			delete this.options.type;

			_.defaults(this.options, default_options[this.type]);

			this.model = new BaseModel(this.options);
			this.model.set('value', this.relatedModel.get(this.key));
			this.listenTo(this.relatedModel, 'change:'+this.key, this.onRelatedModelChange);
			this.listenTo(this.model, 'change:value', this.onChangeValue);
			this.listenTo(this.model, 'change:error', this.onChangeError);

			this.$el.addClass('element').setPrefixedClassname('type', this.type);

			window['el_'+this.type] = this;

		},
		onBeforeRender: function() {
			log('onBeforeRender');
		},
		onRender: function() {
			log('render');
			this.setUiElement();
			this.createChildElementView();
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

		onRelatedModelChange: function(model, value, options) {
			this.model.set('value', value);
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

		templateHelpers: function() {

			var templateHelpers = {
				cid: this.model.cid,
				element_tag: element_tags[this.type]
			};

			return templateHelpers;
		},

		createChildElementView: function() {
			var ChildElementView = view_types[this.type];
			this.element_view = new ChildElementView({
				el: this.ui.element,
				model: this.model,
				key: this.key
			});
			this.element_view.render();
		},

		setUiElement: function() {
			this.ui = this.ui || {};
			var selector = element_selectors[this.type];
			if (! selector) throw new Error('ElementView has no support for ' + this.type);
			this.ui.element = this.$(selector);
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
