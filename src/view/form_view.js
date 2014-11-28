define(function(require) {
	'use strict';

	var
	Form				= require('model/form'),
	ElementView			= require('view/element_view'),
	log					= require('lib/log'); /* jshint ignore: line */


	var FormView = Marionette.LayoutView.extend({
		tagName: 'form',

		elementView: ElementView,

		constructor: function(options) {
			options = options || {};

			// validate model
			if (! (options.model instanceof Form)) {
				if (options.model instanceof Backbone.Model) {
					options.model = new Form(options.model.attributes);
				} else {
					throw new Error('FormView requires a Form model.');
				}
			}

			if (options.elementView) this.elementView = options.elementView;

			// set up render listeners
			this.listenTo(this, 'render', this.onFormRender);

			Marionette.LayoutView.call(this, options);

		},
		onFormRender: function() {
			this.addElementViews();
		},
		addElementViews: function() {
			var elements = this.model.get('elements');
			elements.each(this.addElementView, this);
		},
		addElementView: function(element) {
			var view = new this.elementView({
				el: this.$(element.get('el')),
				model: element
			});
			view.render();
		}

	});

	return FormView;

});
