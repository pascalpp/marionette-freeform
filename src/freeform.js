define(function(require) {
	'use strict';

	var
	Form					= require('src/model/form'),
	Element					= require('src/model/element'),
	ElementList				= require('src/model/element_list'),
	FormView				= require('src/view/form_view'),
	ElementView				= require('src/view/element_view'),
	InputViews				= require('src/view/input_view_types'),
	ErrorView				= require('src/view/error_view'),
	log						= require('src/lib/log');

	var FreeForm = {
		Form: Form,
		Element: Element,
		ElementList: ElementList,
		FormView: FormView,
		ElementView: ElementView,
		InputViews: InputViews,
		ErrorView: ErrorView
	};

	return FreeForm;

});
