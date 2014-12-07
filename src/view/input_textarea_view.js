define(function(require) {
	'use strict';

	var InputView = require('./input_view');


	var InputTextareaView = InputView.extend({

		tagName: 'textarea',
		template: _.template('<%= value %>'),

		attribute_keys: ['id', 'name', 'rows', 'cols', 'placeholder', 'maxlength', 'disabled'],

		triggers: {
			'change': 'input:change',
			'keyup': 'input:change',
		},

	});

	return InputTextareaView;

});
