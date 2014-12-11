define(function(require) {
	'use strict';

	var BaseElement = require('./element.base');


	var RadioElement = BaseElement.extend({

		validateConstructor: function(attrs) {
			if (_.isUndefined(attrs.value)) {
				throw new Error('Radio Element requires a value.');
			}
			return attrs;
		}

	});

	return RadioElement;

});