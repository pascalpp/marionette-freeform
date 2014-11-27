define(function(require) {
	'use strict';

	var InputView = require('./input_view');

	var InputTextView = InputView.extend({
		attributes: function() {
			return {
				type: this.model.get('type'),
				id: this.model.get('id'),
				name: this.model.get('name'),
				size: this.model.get('size'),
				placeholder: this.model.get('placeholder'),
				maxlength: this.model.get('maxlength'),
				value: this.model.get('value')
			};
		}
	});

	return InputTextView;

});
