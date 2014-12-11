define(function(require) {
	'use strict';

	var Marionette = require('marionette');
	var Element = require('src/model/element');
	var InputAttributes = require('./input_attributes');
	var log = require('src/lib/log'); /* jshint ignore: line */

	var InputSelectOptionView = Marionette.ItemView.extend({
		tagName: 'option',
		template: _.template('<%- label %>'),
		attribute_keys: ['value', 'disabled', 'selected']
	});

	_.extend(InputSelectOptionView.prototype, InputAttributes);


	var InputSelectView = Marionette.CollectionView.extend({

		tagName: 'select',

		childView: InputSelectOptionView,
		childViewOptions: function() {
			return {
				selected: this.model.get('value')
			};
		},

		constructor: function(options) {
			// validate model
			if (! (options.model instanceof Element)) throw new Error('InputView requires an Element model.');

			options.collection = options.model.get('values');

			Marionette.CollectionView.call(this, options);

			// listen for external changes to the model
			this.listenTo(this.model, 'change:value', this.onModelChangeValue);

			// these steps allow the view to consume an existing dom element
			this.listenTo(this, 'render', this.setAttributes);
			this.listenTo(this, 'render', this.showPlaceholder);
			var className = this.model.get('className');
			if (className) this.$el.addClass(className);
		},

		attribute_keys: ['id', 'name', 'disabled'],

		triggers: {
			'change': 'input:change',
		},

		showPlaceholder: function() {
			// add placeholder option
			if (this.model.get('placeholder')) {
				var placeholder = new Backbone.Model({
					value: '',
					label: this.model.get('placeholder'),
					disabled: true
				});
				var ChildView = this.getChildView(placeholder);
				this.addChild(placeholder, ChildView, 0);
			}
		},

		onInputChange: function() {
			var value = this.getInputValue();
			this.model.set('value', value, { from: this });
		},

		getInputValue: function() {
			return this.$el.val();
		},
		setInputValue: function(value) {
			return this.$el.val(value);
		},

		onModelChangeValue: function(model, value, options) {
			if (options.from !== this) {
				this.$el.val(value);
			}
		}
	});

	// apply methods from InputAttributes mixin
	_.extend(InputSelectView.prototype, InputAttributes);

	return InputSelectView;

});
