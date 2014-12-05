define(function(require) {
	'use strict';

	var Form = require('src/model/form'),
		FormView = require('src/view/form_view'),
		Template = require('text!./template/related_model.html'),
		log = require('src/lib/log'); /* jshint ignore: line */
	require('src/model/validation');

	/* begin example */
	// some regexes used for validation
	var alphanumeric = new RegExp('^[a-z0-9_\\.]+$', 'i');
	var whitespace = new RegExp('\\s');
	var consecutive_periods = new RegExp('\\.\\.', 'i');
	var consecutive_underscores = new RegExp('__', 'i');
	var alpha_start = new RegExp('^[a-z]', 'i');
	var alphanumeric_end = new RegExp('[a-z0-9]$', 'i');

	// a User model with some validators defined
	var User = Backbone.Model.extend({
		validators: {
			'first_name': function(first_name) {
				if (first_name.length < 3) return 'Your name is kinda short.';
				if (first_name.length > 20) return 'Your name is kinda long.';
			},
			'user_name': function(user_name) {
				/* jshint maxcomplexity: 9 */
				if (! user_name) return 'A username is required.';
				if (! alpha_start.test(user_name)) return 'Your username must start with a letter.';
				if (whitespace.test(user_name)) return 'Your username may not include spaces.';
				if (! alphanumeric.test(user_name)) return 'Your username must be alphanumeric.';
				if (user_name.length < 3) return 'Your username must be at least 3 characters.';
				if (! alphanumeric_end.test(user_name)) return 'Your username must end with a letter or a number.';
				if (consecutive_periods.test(user_name)) return 'Your username may not include consecutive periods.';
				if (consecutive_underscores.test(user_name)) return 'Your username may not include consecutive underscores.';
			},
		},
	});

	// define a user with some attributes
	var user = new User({
		first_name: 'Bob',
		user_name: '',
		admin: true,
	});

	// define an array of form elements
	// each element should have a type and an el
	// label is optional
	// use a related_key to link the element to an attribute of another model
	// (e.g. the user defined above)
	// element's initial value is derived from related_model.get(related_key)
	var elements = [
		{
			el: '.firstname',
			type: 'text',
			related_key: 'first_name',
			label: 'First Name'
		},
		{
			el: '.username',
			type: 'text',
			related_key: 'user_name',
			label: 'Username'
		},
		{
			el: '.admin',
			type: 'checkbox',
			related_key: 'admin',
			label: 'Administrator'
		},
		// a buttonset defines a list of buttons to be shown together
		// see the basic example for explanations of the different button types
		{
			el: '.buttons',
			type: 'buttonset',
			buttons: [
				{
					type: 'submit',
					label: 'Submit',
					trigger: 'click:submit'
				},
				{
					type: 'reset',
					label: 'Reset',
					trigger: 'click:reset'
				},
				{
					type: 'button',
					label: 'Cancel',
					trigger: 'click:cancel'
				},
			]
		}
	];

	// define a form model
	// pass in our array of elements
	// pass in our user as the related_model
	var form = new Form({
		elements: elements,
		related_model: user
	});

	// create a form view to display the form
	var form_view = new FormView({
		template: _.template(Template),
		model: form
	});
	/* end example */

	return form_view;


});
