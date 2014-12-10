define(function(require) {
	'use strict';

	var
	Marionette				= require('marionette'),
	Model					= require('src/model/model'),
	Element					= require('src/model/element'),
	ElementList				= require('src/model/element_list'),
	Form					= require('src/model/form'),
	FormView				= require('src/view/form_view'),
	ElementView				= require('src/view/element_view'),
	InputViewTypes			= require('src/view/input_view_types'),
	LabelView				= require('src/view/label_view'),
	log						= require('src/lib/log'); /* jshint ignore: line */

	var FreeForm = {
		Model: Model,
		Element: Element,
		ElementList: ElementList,
		Form: Form,
		FormView: FormView,
		ElementView: ElementView,
		InputViewTypes: InputViewTypes,
		LabelView: LabelView
	};

	Marionette.FreeForm = FreeForm;

	return FreeForm;

});
