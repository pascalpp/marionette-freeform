define(function(require) {
	'use strict';

	var InputView = require('./input_view');


	var InputRadioView = InputView.extend({

		attribute_keys: ['type', 'id', 'name', 'disabled', 'checked', 'value'],

		onInputChange: function() {
			var checked = this.$el.is(':checked');
			this.model.set('checked', checked);
		},

		getInputValue: function() {
			var checked = this.$el.is(':checked');
			var value = this.model.get('value');
			if (checked) return value;
		},

		setInputValue: function(value) {
			var checked = (this.model.get('value') === value);
			this.$el.prop('checked', checked);
		}
	});

	return InputRadioView;

});
