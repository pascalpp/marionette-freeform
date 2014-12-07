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
		var object = { type: type };
		var extras = {};
		switch(type) {
			case 'buttonfield':
				extras = {
					input: { type: 'text' },
					button: { type: 'submit' }
				};
				break;
			case 'select':
				extras = {
					values: [
						{ value: 'foo', label: 'Foo' },
						{ value: 'bar', label: 'Bar' },
						{ value: 'baz', label: 'Baz' },
					]
				};
				break;
		}
		_.extend(object, extras);
		return object;
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
