define(function(require) {
	'use strict';

	var
	Element				= require('src/model/element'),
	InputViews			= require('./input_view_types'),
	ErrorView			= require('./error_view'),
	Template			= require('text!src/template/element.html'),
	log					= require('src/lib/log'); /* jshint ignore: line */
	require('src/lib/setPrefixedClassname');


	var ElementView = Marionette.LayoutView.extend({
		tagName: 'fieldset',
		template: _.template(Template),

		regions: {
			input_region: '.input-region',
			error_region: '.error-region'
		},
		elementViewEvents: {
			'before:render': 'onBeforeElementRender',
			'render': 'onElementRender',
			'all': 'onAll'
		},
		elementModelEvents: {
			'change:value': 'onChangeValue',
			'change:error': 'onChangeError'
		},

		constructor: function(options) {
			options = options || {};

			var model = options.model;

			// validate model
			if (! (model instanceof Element)) throw new Error('ElementView requires an Element model');

			// set type
			this.type = model.get('type');

			Marionette.LayoutView.call(this, options);

			this.setupRelatedModel(model);
			this.bindEntityEvents(this, this.elementViewEvents);
			this.bindEntityEvents(model, this.elementModelEvents);

			window['el_'+this.type] = this;

		},

		setupRelatedModel: function(model) {
			var related_model = model.get('related_model') || model.collection && model.collection.related_model,
				related_key = model.get('related_key');

			if (related_model && related_key) {
				this.listenTo(related_model, 'change:'+related_key, this.onRelatedModelChange);
				this.related_model = related_model;
				this.related_key = related_key;

				// get value from the related model
				model.set('value', related_model.get(related_key));
			}

		},



		onAll: function(event_name) {
			//log(event_name, arguments);
		},
		onRelatedModelChange: function(model, value, options) {
			this.model.set('value', value);
		},
		onBeforeElementRender: function() {

		},
		onElementRender: function() {
			this.$el.addClass('element').setPrefixedClassname('type', this.type);
			if (_(['submit', 'reset']).contains(this.type)) {
				this.$el.addClass('type-button');
			}
			this.createInputView();
		},
		createInputView: function() {
			var InputView = this.getInputView();
			this.input_view = new InputView({
				model: this.model
			});
			this.input_region.show(this.input_view);
		},
		getInputView: function() {
			var InputView = this.inputView || InputViews[this.type];
			if (! InputView) throw new Error('No InputView defined for type ' + this.type);
			return InputView;
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
				error = validator.call(this.model, value);
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
