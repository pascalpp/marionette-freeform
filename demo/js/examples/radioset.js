define(function(require) {
	'use strict';

	var Model = require('src/model/model'),
		Form = require('src/model/form'),
		FormView = require('src/view/form_view'),
		Template = require('text!./template/single.html'),
		log = require('src/lib/log'); /* jshint ignore: line */

	Model.mixin(Backbone.Model);

	/* begin example */

	// define a single radioset element
	// radiosets must supply a list of values
	var elements = [
		{
			el: '.example',
			type: 'radioset',
			label: 'What’s your favorite?',
			validator: function(value) {
				if (value === 'poop') return 'You’re crazy!';
			},
			values: [
				{ value: 'pizza', label: 'Pizza' },
				{ value: 'chocolate', label: 'Chocolate' },
				{ value: 'icecream', label: 'Ice Cream' },
				{ value: 'poop', label: 'Poop' },
			]
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
