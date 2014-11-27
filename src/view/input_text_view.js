define(function(require) {
	'use strict';

	var InputView = require('./input_view');

	// <input type="text" id="[[ data.id ]]" name="[[ data.name ]]" value="{{ data.value }}">
	var InputTextView = InputView.extend({
		attributes: function() {
			return {
				id: this.model.cid,
				name: this.model.cid,
				size: this.model.get('size'),
				placeholder: this.model.get('placeholder'),
				maxlength: this.model.get('maxlength'),
				value: this.model.get('value')
			};
		}
	});

	return InputTextView;

});
