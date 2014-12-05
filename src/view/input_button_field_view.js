define(function(require) {
	'use strict';

	var
	Element				= require('model/element'),
	log					= require('lib/log'); /* jshint ignore: line */


	var InputViews;

	var InputButtonFieldView = Marionette.ItemView.extend({

		tagName: 'span',

		template: _.template('<input><button></button>'),

		ui: {
			input: 'input',
			button: 'button',
		},

		initialize: function() {
			// have to lazy-require this to prevent a circular dependency
			InputViews = require('./input_view_types');

			var input = this.model.get('input');
			if (! (input instanceof Element)) {
				input = new Element(input);
				this.model.set('input', input);
			}
			this.listenTo(input, 'change:value', this.onChangeInputValue);

			var button = this.model.get('button');
			if (! (button instanceof Element)) {
				button = new Element(button);
				this.model.set('button', button);
			}
		},

		onRender: function() {
			var input = this.model.get('input');
			var InputView = InputViews[input.get('type')];
			this.input_view = new InputView({
				el: this.ui.input,
				model: input
			});
			this.input_view.render();

			var button = this.model.get('button');
			var ButtonView = InputViews[button.get('type')];
			log(ButtonView.prototype);
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
