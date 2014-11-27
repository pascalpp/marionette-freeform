define(function(require) {
	'use strict';

	var Marionette = require('marionette');
	var Element = require('model/element');
	var Template = require('text!template/main_view.html');

	_.templateSettings.evaluate = /<:([\s\S]+?):>/g; // <: javascript logic :>

	var MainView = Marionette.LayoutView.extend({
		el: '.main',
		template: _.template(Template)
	});

	var main_view = new MainView();
	main_view.render();


});

