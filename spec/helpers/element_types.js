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

	var generateElementOptions = function(type) {
		if (type === 'buttonfield') {
			return {
				type: type,
				input: { type: 'text' },
				button: { type: 'submit' }
			};
		} else {
			return { type: type };
		}
	};

	var objects = _.map(types, generateElementOptions);

	var index = {};
	_.each(types, function(type) {
		index[type] = generateElementOptions(type);
	});


	return {
		types: types,
		objects: objects,
		index: index
	};

});
