define(function(require) {
	'use strict';

	var Form = require('model/form'),
		FormView = require('view/form_view'),
		Template = require('text!template/form.html'),
		log = require('lib/log'); /* jshint ignore: line */
	require('model/validation');

	/* begin example */
	// define an array of form elements
	// each element should have a type and an el
	// label is optional
	// each element can provide its own validator function
	var elements = [
		{
			el: '.username',
			type: 'text',
			label: 'Username',
			validator: function(value) {
				if (! value) return 'A username is required.';
			}
		},
		{
			el: '.firstname',
			type: 'text',
			label: 'First Name',
			validator: function(value) {
				if (value.toLowerCase() === 'bob') {
					return 'Your first name can’t be Bob.';
				}
			}
		},
		{
			el: '.admin',
			type: 'checkbox',
			label: 'Administrator'
		},
	];

	// define a form model
	// pass in our array of elements
	var form = new Form({
		elements: elements
	});

	// create a form view to display the form
	var form_view = new FormView({
		el: 'form',
		template: _.template(Template),
		model: form
	});
	form_view.render();


	/* end example */
});
