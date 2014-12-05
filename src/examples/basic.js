define(function(require) {
	'use strict';

	var Form = require('model/form'),
		FormView = require('view/form_view'),
		Template = require('text!template/basic.html'),
		log = require('lib/log'); /* jshint ignore: line */
	require('model/validation');

	/* begin example */
	// define an array of form elements
	// each element should have a `type`
	// and an `el` selector matching a DOM element in your template
	// label and value is optional
	// each element can provide its own validator function
	var elements = [
		{
			el: '.name',
			type: 'text',
			label: 'First Name',
			value: 'A first name',
			validator: function(value) {
				if (value.toLowerCase() === 'bob') {
					return 'Your first name can’t be Bob.';
				}
				if (value.toLowerCase() === 'david') {
					return 'Your first name can’t be David.';
				}
			}
		},
		// `select` elements require a list of values to be shown in the dropdown
		// if you define a `value`, the menu item matching that value will be pre-selected
		// if you define a `placeholder`, an extra menu item will be inserted at the top
		{
			el: '.role',
			type: 'select',
			label: 'Role',
			placeholder: 'Choose one:',
			values: [
				{ label: 'Engineer', value: 'eng' },
				{ label: 'Producer', value: 'prod' },
				{ label: 'Management', value: 'mgmt' },
				{ label: 'Human Resources', value: 'hr' },
			],
			validator: function(value) {
				if (value === 'mgmt') {
					return 'You don’t look like management material.';
				}
			}
		},
		{
			el: '.description',
			type: 'textarea',
			label: 'Description',
			value: 'A sample description',
			rows: 4,
			validator: function(value) {
				if (! value) return 'A description is required.';
				if (value === 'dumb') return 'Your description can’t be dumb.';
			}
		},
		{
			el: '.terms',
			type: 'checkbox',
			label: 'I like forms.',
			validator: function(value) {
				if (! value) {
					return 'You don’t like forms?';
				}
			}
		},
		// a button element can have type `submit`, `reset`, or generic `button`
		// for submit/reset buttons, the native submit/reset actions will fire as usual
		// FormView captures the submit event and validates before allowing submission to continue
		// buttons can also define a `trigger` gets fired when the button is clicked
		// (not yet sure how best to bubble that trigger event up to the FormView)
		{
			el: '.button',
			type: 'submit',
			label: 'Submit',
			trigger: 'click:submit'
		},

	];

	// define a form model
	// pass in our array of elements
	var form = new Form({
		elements: elements
	});

	// create a form view to display the form
	var form_view = new FormView({
		template: _.template(Template),
		model: form
	});
	/* end example */

	return form_view;

});
