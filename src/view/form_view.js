define(function(require) {
	'use strict';

	var
	Form				= require('model/form'),
	ElementView			= require('view/element_view'),
	log					= require('lib/log'); /* jshint ignore: line */


	var FormView = Marionette.LayoutView.extend({
		tagName: 'form',

		elementView: ElementView,

		formViewEvents: {
			'render': 'onFormRender'
		},

		triggers: {
			'submit': 'before:form:submit'
		},

		constructor: function(options) {
			options = options || {};

			// set up form model
			options.model = this.setupFormModel(options.model);

			// validate elementView
			if (options.elementView) this.elementView = options.elementView;
			this.validateElementView();

			Marionette.LayoutView.call(this, options);

			// bind view events
			this.bindEntityEvents(this, this.formViewEvents);

		},

		setupFormModel: function(model) {
			if (model instanceof Form) return model;

			if (model instanceof Backbone.Model) {
				model = new Form(model.attributes);
			} else {
				throw new Error('FormView requires a Form model.');
			}

			return model;
		},

		validateElementView: function() {
			if (this.elementView === ElementView) return;
			if (this.elementView.prototype instanceof ElementView) return;
			throw new Error('FormView.elementView must be an ElementView.');
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
		},

		onBeforeFormSubmit: function() {
			if (this.model.isValid()) {
				this.triggerMethod('form:submit');
				log('Form is valid. Implement your own onFormSubmit handler to do something with the form data.')
			} else {
				this.triggerMethod('form:submit:error', this.model.validationError);
				log('Form is not valid.', this.model.validationError)
			}
		}

	});

	return FormView;

});
