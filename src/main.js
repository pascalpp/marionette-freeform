define(function(require) {
	'use strict';

	var
	Element				= require('model/element'),
	ElementView			= require('view/element_view'),
	Template			= require('text!template/main_view.html'),
	log					= require('lib/log'); /* jshint ignore: line */
	require('model/validation');


	var alphanumeric = new RegExp('^[a-z0-9_\\.]+$', 'i');
	var whitespace = new RegExp('\\s');
	var consecutive_periods = new RegExp('\\.\\.', 'i');
	var consecutive_underscores = new RegExp('__', 'i');
	var alpha_start = new RegExp('^[a-z]', 'i');
	var alphanumeric_end = new RegExp('[a-z0-9]$', 'i');

	var User = Backbone.Model.extend({
		validators: {
			'user_name': function(user_name) {
				/* jshint maxcomplexity: 9 */
				if (! user_name) return 'A username is required.';
				if (user_name.length < 3) return 'Your username must be at least 3 characters.';
				if (whitespace.test(user_name)) return 'Your username may not include spaces.';
				if (! alphanumeric.test(user_name)) return 'Your username must be alphanumeric.';
				if (! alpha_start.test(user_name)) return 'Your username must start with a letter.';
				if (! alphanumeric_end.test(user_name)) return 'Your username must end with a letter or a number.';
				if (consecutive_periods.test(user_name)) return 'Your username may not include consecutive periods.';
				if (consecutive_underscores.test(user_name)) return 'Your username may not include consecutive underscores.';
			}
		},
	});

	var user = new User({ user_name: 'pascal' });

	var text_element = new Element({
		type: 'text',
		value: 'Free Form',
		related_model: user,
		related_key: 'user_name',
		label: 'Username',
		el: '.username',
		validator: function(value) {

		}
	});
	text_element.on('change:value', function(model, value, options) {
		console.log(value);
	});


	var MainView = Marionette.LayoutView.extend({
		el: '.main',
		template: _.template(Template),
		onRender: function() {
			var username_view = new ElementView({
				el: this.$(text_element.get('el')),
				model: text_element
			});
			username_view.render();
		}
	});

	var main_view = new MainView();
	main_view.render();


});
