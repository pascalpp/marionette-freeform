define(function(require) {
	'use strict';

	var InputView = require('./input_view');

	var InputTextView = InputView.extend({

		attribute_keys: ['type', 'id', 'name', 'value', 'size', 'placeholder', 'maxlength', 'disabled'],

		triggers: {
			'change': 'input:change',
			'keyup': 'input:change',
		},

	});

	return InputTextView;

});
