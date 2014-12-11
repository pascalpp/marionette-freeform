define(function(require) {
	'use strict';

	var BaseElement = require('./element.base');
	var ButtonfieldElement = require('./element.buttonfield');
	var ButtonsetElement = require('./element.buttonset');
	var CheckboxElement = require('./element.checkbox');
	var RadioElement = require('./element.radio');
	var RadiosetElement = require('./element.radioset');
	var SelectElement = require('./element.select');


	var ElementTypes = {
		'button': BaseElement,
		'buttonfield': ButtonfieldElement,
		'buttonset': ButtonsetElement,
		'checkbox': CheckboxElement,
		'password': BaseElement,
		'radio': RadioElement,
		'radioset': RadiosetElement,
		'reset': BaseElement,
		'select': SelectElement,
		'submit': BaseElement,
		'text': BaseElement,
		'textarea': BaseElement,
	};

	return ElementTypes;

});