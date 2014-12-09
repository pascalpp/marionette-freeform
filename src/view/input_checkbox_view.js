define(function(require) {
	'use strict';

	var InputView = require('./input_view');


	var InputCheckboxView = InputView.extend({

		attribute_keys: ['type', 'id', 'name', 'disabled', 'checked', 'value'],

		getInputValue: function() {
			var checked = this.$el.is(':checked');
			var value = this.model.get('value');
			if (_.isFunction(value)) {
				// if value is a function, evaluate it and return the result
				return value.call(this, checked);
			} else {
				// only return value if this is checked, else return undefined
				if (checked) return value;
			}
		},
		setInputValue: function(value) {
			var checked = (value === this.model.get('value'));
			return this.$el.prop('checked', checked);
		}

	});

	return InputCheckboxView;

});
