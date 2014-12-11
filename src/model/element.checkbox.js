define(function(require) {
	'use strict';

	var BaseElement = require('./element.base');


	var CheckboxElement = BaseElement.extend({

		elementEvents: {
			'change:checked': 'validateElement'
		}

	});

	return CheckboxElement;

});