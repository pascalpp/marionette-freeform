define(function(require) {
	'use strict';

	var
	Form				= require('src/model/form'),
	ElementView			= require('./element_view'),
	InputViews			= require('./input_view_types'),
	log					= require('src/lib/log'); /* jshint ignore: line */


	var FormView = Marionette.LayoutView.extend({
		tagName: 'form',

		elementView: ElementView,

		formViewEvents: {
			'render': 'onFormRender'
		},

		triggers: {
			'submit': 'before:form:submit',
			'reset': {
				event: 'form:reset',
				preventDefault: false,
				stopPropagation: false
			}
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
		onFormReset: function() {
			// form reset doesn't trigger any change event on the inputs that are changed by resetting
			// so we have to shim that event in order to reset any validation errors
			// have to defer this so the reset event can complete and values are restored
			_.defer(_.bind(function() {
				this.$('input, select, textarea').trigger('change');
			}, this));
		},

		addElementViews: function() {
			var elements = this.model.get('elements');
			elements.each(this.addElementView, this);
		},

		addElementView: function(element) {
			var View = this.getElementView(element);
			var view = new View({
				el: this.$(element.get('el')),
				model: element
			});
			view.render();
		},

		getElementView: function(element) {
			if (element.get('raw')) {
				var type = element.get('type');
				var View = InputViews[type];
				if (View) {
					return View;
				} else {
					throw new Error('No raw InputView defined for type '+ type);
				}
			} else {
				return this.elementView;
			}
		},

		onBeforeFormSubmit: function() {
			if (this.model.isValid()) {
				this.triggerMethod('form:submit');
				log('Form is valid. Implement your own onFormSubmit handler to do something with the form data.');
			} else {
				this.triggerMethod('form:submit:error', this.model.validationError);
				log('Form is not valid.', this.model.validationError);
			}
		}

	});

	return FormView;

});
