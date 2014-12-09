define(function(require) {
	'use strict';

	var
	InputTextView			= require('./input_text_view'),
	InputTextareaView		= require('./input_textarea_view'),
	InputCheckboxView		= require('./input_checkbox_view'),
	InputRadioView			= require('./input_radio_view'),
	InputRadiosetView		= require('./input_radioset_view'),
	InputSelectView			= require('./input_select_view'),
	InputButtonView			= require('./input_button_view'),
	InputButtonsetView		= require('./input_buttonset_view'),
	InputButtonFieldView	= require('./input_button_field_view');


	var InputViewTypes = {
		text: InputTextView,
		password: InputTextView,
		textarea: InputTextareaView,
		checkbox: InputCheckboxView,
		radio: InputRadioView,
		radioset: InputRadiosetView,
		select: InputSelectView,
		submit: InputButtonView,
		reset: InputButtonView,
		button: InputButtonView,
		buttonset: InputButtonsetView,
		buttonfield: InputButtonFieldView
	};

	return InputViewTypes;

});
