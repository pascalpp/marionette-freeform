define(function(require) {
	'use strict';

	var Form = require('src/model/form'),
		FormView = require('src/view/form_view'),
		Template = require('text!./template/button_field.html'),
		log = require('src/lib/log'); /* jshint ignore: line */
	require('src/model/validation');

	/* begin example */
	// a regex for email validation
	var email_regex = new RegExp(/^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);

	// define a single buttonfield element
	// buttonfields must supply an input and a button
	var elements = [
		{
			el: '.email',
			type: 'buttonfield',
			label: 'Join our mailing list:',
			validator: function(value) {
				if (value && ! email_regex.test(value)) return 'Please enter a valid email address.';
			},
			input: {
				type: 'text',
				placeholder: 'Enter your email address'
			},
			button: {
				type: 'submit',
				label: 'Subscribe',
			}
		}

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
