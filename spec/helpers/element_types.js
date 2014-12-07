define(function(require) {
	'use strict';

	// this helper generates a valid options object for a given element type
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
			case 'buttonset':
				extras = {
					buttons: [
						{ type: 'submit', label: 'Submit' },
						{ type: 'reset', label: 'Reset' },
						{ type: 'button', label: 'Button' },
					]
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

	// this helper returns a jquery selector matching the html input for a given element type
	var generateHtmlInputSelector = function(type) {
		/* jshint maxcomplexity: 9 */
		var sel;
		switch(type) {
			case 'select':
			case 'textarea':
				sel = type;
				break;
			case 'submit':
			case 'reset':
			case 'button':
				sel = 'button[type='+type+']';
				break;
			case 'buttonset':
				// don't know what types of buttons are in a buttonset
				sel = 'button';
				break;
			case 'buttonfield':
				sel = 'input[type=text]';
				break;
			default:
				sel = 'input[type='+type+']';
		}
		return sel;
	};


	// a list of all supported types - more to come
	var types = [
		'text',
		'password',
		'textarea',
		'checkbox',
		'select',
		'buttonfield',
		'submit',
		'reset',
		'button',
		'buttonset'
	];

	// a list of valid options objects for each type
	var objects = _.map(types, generateElementOptions);

	// a dict of valid options objects, indexed by type
	var index = {};
	_.each(types, function(type) {
		index[type] = generateElementOptions(type);
	});

	// a list of html input selectors, indexed by type
	var selectors = {};
	_.each(types, function(type) {
		selectors[type] = generateHtmlInputSelector(type);
	});

	return {
		types: types,
		objects: objects,
		index: index,
		selectors: selectors
	};

});
