define(function(require) {
	'use strict';

	var
	Marionette			= require('marionette'),
	Element				= require('src/model/element'),
	InputViewTypes		= require('./input_view_types'),
	ErrorView			= require('./error_view'),
	Template			= require('text!src/template/element.html'),
	log					= require('src/lib/log'); /* jshint ignore: line */
	require('src/lib/setPrefixedClassname');


	var ElementView = Marionette.LayoutView.extend({
		tagName: 'fieldset',
		className: 'element',
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
			'change:error': 'onChangeError'
		},

		constructor: function(options) {
			options = options || {};

			var model = options.model;

			// validate model
			if (! (model instanceof Element)) throw new Error('ElementView requires an Element model.');

			// set type
			this.type = model.get('type');

			Marionette.LayoutView.call(this, options);

			this.bindEntityEvents(this, this.elementViewEvents);
			this.bindEntityEvents(model, this.elementModelEvents);

		},

		onAll: function(event_name) {
			//log(event_name, arguments);
		},
		onBeforeElementRender: function() {

		},
		onElementRender: function() {
			var className = _.result(this, 'className');
			if (className) this.$el.addClass(className);
			this.$el.setPrefixedClassname('type', this.type);
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
			var InputView = this.inputView || InputViewTypes[this.type];
			if (! InputView) throw new Error('No InputView defined for type ' + this.type);
			return InputView;
		},

		onChangeError: function(model, error, options) {
			var class_prefix = _.result(this, 'className');
			var error_class = class_prefix + '-' + this.model.get('error_class');

			if (error) {
				var error_view = new ErrorView({
					for: this.model.get('id'),
					error: error,
					className: this.model.get('error_class')
				});
				this.error_region.show(error_view);
				this.$el.addClass(error_class);
			} else {
				this.error_region.empty();
				this.$el.removeClass(error_class);
			}
		}

	});

	return ElementView;

});
