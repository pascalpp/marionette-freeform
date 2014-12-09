define(function(require) {
	'use strict';

	var Marionette = require('marionette');
	var Element = require('src/model/element');
	var log = require('src/lib/log'); /* jshint ignore: line */


	var InputButtonFieldView = Marionette.ItemView.extend({

		tagName: 'span',

		template: _.template('<input><button></button>'),

		ui: {
			input: 'input',
			button: 'button',
		},

		constructor: function() {
			Marionette.ItemView.apply(this, arguments);

			// validate model
			if (! (this.model instanceof Element)) throw new Error('InputView requires an Element model.');

			var input = this.model.get('input');
			this.listenTo(input, 'change:value', this.onChangeInputValue);

			// these steps allow the view to consume an existing dom element
			this.listenTo(this, 'render', this.setAttributes);
			var className = this.model.get('className');
			if (className) this.$el.addClass(className);
		},

		onRender: function() {
			var input = this.model.get('input');
			var InputViewTypes = Marionette.FreeForm.InputViewTypes;
			var InputView = InputViewTypes[input.get('type')];

			this.input_view = new InputView({
				el: this.ui.input,
				model: input
			});
			this.input_view.render();

			var button = this.model.get('button');
			var ButtonView = InputViewTypes[button.get('type')];
			this.button_view = new ButtonView({
				el: this.ui.button,
				model: button
			});
			this.button_view.render();

		},

		onChangeInputValue: function(model, value, options) {
			// consume input value changes as if they are our own
			this.model.set('value', value);
		}

	});

	return InputButtonFieldView;

});
