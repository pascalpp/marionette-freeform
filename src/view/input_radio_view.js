define(function(require) {
	'use strict';

	var InputView = require('./input_view');


	var InputRadioView = InputView.extend({

		attribute_keys: ['type', 'id', 'name', 'disabled'],

		attributes: function() {
			// use super method to apply attribute_keys
			var attributes = InputView.prototype.attributes.call(this);

			// add checked attribute as forced boolean of model.value
			attributes['checked'] = (this.model.get('value') === this.options.selected);

			return attributes;
		},

		onInputChange: function() {

		},

		getInputValue: function() {
			return this.$el.is(':checked');
		},

		setInputValue: function(value) {
			var checked = (this.model.get('value') === value);
			this.$el.prop('checked', checked);
		}
	});

	return InputRadioView;

});
