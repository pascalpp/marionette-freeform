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
						{ value: '', label: 'None' },
						{ value: 'foo', label: 'Foo' },
						{ value: 'bar', label: 'Bar' },
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

	var supported_attributes = {
		text: ['class', 'type', 'id', 'name', 'value', 'size', 'placeholder', 'maxlength', 'disabled'],
		password: ['class', 'type', 'id', 'name', 'value', 'size', 'placeholder', 'maxlength', 'disabled'],
		textarea: ['class', 'id', 'name', 'rows', 'cols', 'placeholder', 'maxlength', 'disabled'],
		checkbox: ['class', 'type', 'id', 'name', 'disabled', 'checked'],
		select: ['class', 'id', 'name', 'disabled'],
		buttonfield: ['class'],
		submit: ['class', 'type', 'id', 'name', 'disabled'],
		reset: ['class', 'type', 'id', 'name', 'disabled'],
		button: ['class', 'type', 'id', 'name', 'disabled'],
		buttonset: ['class'],
	};

	var default_attributes = {
		text: ['type', 'id', 'name', 'value'],
		password: ['type', 'id', 'name', 'value'],
		textarea: ['id', 'name'],
		checkbox: ['type', 'id', 'name'],
		select: ['id', 'name'],
		buttonfield: [],
		submit: ['type', 'id', 'name'],
		reset: ['type', 'id', 'name'],
		button: ['type', 'id', 'name'],
		buttonset: [],
	};

	var valid_attribute_values = {
		'checked': true,
		'class': 'foo',
		'cols': 20,
		'disabled': true,
		'id': 'foo',
		'maxlength': 20,
		'name': 'foo',
		'placeholder': 'foo',
		'rows': 5,
		'size': 6,
	};

	var getValidAttributeValue = function(attr, type) {
		if (attr === 'type') return type;
		return valid_attribute_values[attr];
	};

	return {
		types: types,
		objects: objects,
		index: index,
		selectors: selectors,
		supported_attributes: supported_attributes,
		default_attributes: default_attributes,
		getValidAttributeValue: getValidAttributeValue
	};

});
