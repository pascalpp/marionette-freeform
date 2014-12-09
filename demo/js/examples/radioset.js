define(function(require) {
	'use strict';

	var Model = require('src/model/model'),
		Form = require('src/model/form'),
		FormView = require('src/view/form_view'),
		Template = require('text!./template/single.html'),
		log = require('src/lib/log'); /* jshint ignore: line */

	Model.mixin(Backbone.Model);

	/* begin example */

	// define a radioset element
	// radiosets must supply a list of values
	var elements = [
		{
			el: '.example',
			type: 'radioset',
			label: 'What’s your favorite?',
			validator: function(value) {

			},
			values: [
				{ value: 'pizza', label: 'Pizza' },
				{ value: 'chocolate', label: 'Chocolate' },
				{ value: 'icecream', label: 'Ice Cream' },
				{ value: 'coffee', label: 'Coffee' },
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
