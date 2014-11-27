define(function(require) {
	'use strict';

	var Backbone = require('backbone');

	require('model/validation');


	var Element = Backbone.Model.extend({
		defaults: {
			type: null,
			value: null,
			label: null,
			placeholder: null,
			name: null,
			id: null,
			related_model: null,
			key: null,
			validator: null,
			error: null,

			// view options
			el: null,
			show_label: null,
			show_label_before: null,
			show_label_after: null,
			label_class: 'label',
			error_class: 'error'
		}
	});

	return Element;

});