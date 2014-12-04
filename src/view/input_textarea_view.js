define(function(require) {
	'use strict';

	var InputView = require('./input_view');

	var InputTextareaView = InputView.extend({

		tagName: 'textarea',
		template: _.template('<%= value %>'),

		attributes: function() {
			return {
				id: this.model.get('id'),
				name: this.model.get('name'),
				rows: this.model.get('rows'),
				cols: this.model.get('cols'),
				placeholder: this.model.get('placeholder'),
				maxlength: this.model.get('maxlength'),
			};
		},

		triggers: {
			'change': 'input:change',
			'keyup': 'input:change',
		},

	});

	return InputTextareaView;

});
