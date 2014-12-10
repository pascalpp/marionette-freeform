define(function(require) {
	'use strict';

	var
	Marionette			= require('marionette'),
	Element				= require('src/model/element'),
	InputViewTypes		= require('./input_view_types'),
	LabelView			= require('./label_view'),
	Template			= require('text!src/template/element.html'),
	log					= require('src/lib/log'); /* jshint ignore: line */
	require('src/lib/setPrefixedClassname');


	var ElementView = Marionette.LayoutView.extend({
		tagName: 'fieldset',
		className: 'element',
		template: _.template(Template),

		regions: function(options) {
			var regions = {};
			regions.input_region = '> .input-region';

			if (options.model.get('show_label_before') || options.model.get('show_label_after')) {
				regions.label_region = '> .label-region';
			}
			if (options.model.get('show_error')) {
				regions.error_region = '> .error-region';
			}

			return regions;
		},
		elementViewEvents: {
			'before:render': 'onBeforeElementRender',
			'render': 'onElementRender',
			'all': 'onAll'
		},
		elementModelEvents: {
			'change:label': 'showLabel',
			'change:error': 'showError'
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

			this.showLabel();
			this.showError();
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

		showLabel: function() {
			if (! this.label_region) return;

			var label = this.model.get('label');

			if (label) {
				var label_view = new LabelView({
					for: this.model.get('id'),
					label: label,
					className: this.model.get('label_class')
				});
				this.label_region.show(label_view);
			} else {
				this.label_region.empty();
			}
		},

		showError: function() {
			if (! this.error_region) return;

			var error = this.model.get('error');
			var class_prefix = _.result(this, 'className');
			var error_class = class_prefix + '-' + this.model.get('error_class');

			if (error) {
				var error_view = new LabelView({
					for: this.model.get('id'),
					label: error,
					className: this.model.get('error_class')
				});
				this.error_region.show(error_view);
				this.$el.addClass(error_class);
			} else {
				this.error_region.empty();
				this.$el.removeClass(error_class);
			}
		},


	});

	return ElementView;

});
