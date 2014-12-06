define(function(require) {
	'use strict';

	var types = [
		'text',
		'password',
		'textarea',
		'checkbox',
		'select',
		'buttonfield',
		'submit',
		'reset',
		'button'
	];

	var elements = _.map(types, function(type) {
		if (type === 'buttonfield') {
			return {
				type: type,
				input: { type: 'text' },
				button: { type: 'submit' }
			};
		} else {
			return { type: type };
		}
	});

	return {
		types: types,
		objects: elements
	};

});
