define(function(require) {
	'use strict';

	var InputView = Marionette.ItemView.extend({
		tagName: 'input',
		template: _.template(''),

		constructor: function() {
			Marionette.ItemView.apply(this, arguments);

			// listen for external changes to the model
			this.listenTo(this.model, 'change:value', this.onModelChangeValue);

			// these steps allow the view to consume and existing dom element
			this.listenTo(this, 'render', this.setAttributes);
			var className = this.model.get('className');
			if (className) this.$el.addClass(className);
		},
		initialize: function() {
		},
		setAttributes: function() {
			var attributes = _.result(this, 'attributes');
			this.$el.attr(attributes);
		},
		triggers: {
			'change': 'input:change',
			'keyup': 'input:change'
		},
		onInputChange: function() {
			var value = this.getInputValue();
			this.model.set('value', value, { from: this });
		},
		getInputValue: function() {
			return this.$el.val();
		},
		onModelChangeValue: function(model, value, options) {
			if (options.from !== this) {
				this.$el.val(value);
			}
		}
	});

	return InputView;

});
