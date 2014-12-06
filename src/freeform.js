define(function(require) {
	'use strict';

	var
	Model					= require('src/model/model'),
	Element					= require('src/model/element'),
	ElementList				= require('src/model/element_list'),
	Form					= require('src/model/form'),
	FormView				= require('src/view/form_view'),
	ElementView				= require('src/view/element_view'),
	InputViews				= require('src/view/input_view_types'),
	ErrorView				= require('src/view/error_view'),
	log						= require('src/lib/log');

	var FreeForm = {
		Model: Model,
		Element: Element,
		ElementList: ElementList,
		Form: Form,
		FormView: FormView,
		ElementView: ElementView,
		InputViews: InputViews,
		ErrorView: ErrorView
	};

	return FreeForm;

});
