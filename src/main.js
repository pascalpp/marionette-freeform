define(function(require) {
	'use strict';

	var Element = require('model/element');
	var ElementView = require('view/element_view');
	var Template = require('text!template/main_view.html');

	var text_element = new Element({
		type: 'text',
		value: 'Free Form',
		label: 'Username',
		el: '.username'
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
