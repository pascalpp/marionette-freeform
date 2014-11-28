define(function(require) {
	'use strict';

	var InputView = require('./input_view');

	var InputCheckboxView = InputView.extend({
		attributes: function() {
			return {
				type: this.model.get('type'),
				id: this.model.get('id'),
				name: this.model.get('name'),
				size: this.model.get('size'),
				checked: !! this.model.get('value')
			};
		},
		getInputValue: function() {
			return this.$el.is(':checked');
		}
	});

	return InputCheckboxView;

});
