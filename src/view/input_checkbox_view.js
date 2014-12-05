define(function(require) {
	'use strict';

	var InputView = require('./input_view');

	var InputCheckboxView = InputView.extend({

		attribute_keys: ['type', 'id', 'name', 'disabled'],

		attributes: function() {
			// use super method to apply attribute_keys
			var attributes = InputView.prototype.attributes.call(this);

			// add checked attribute as forced boolean of model.value
			attributes['checked'] = !! this.model.get('value');

			return attributes;
		},

		getInputValue: function() {
			return this.$el.is(':checked');
		}

	});

	return InputCheckboxView;

});
