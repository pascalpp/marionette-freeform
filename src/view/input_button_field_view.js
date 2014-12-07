define(function(require) {
	'use strict';

	var Marionette = require('marionette');
	var log = require('src/lib/log'); /* jshint ignore: line */


	var InputViewTypes;

	var InputButtonFieldView = Marionette.ItemView.extend({

		tagName: 'span',

		template: _.template('<input><button></button>'),

		ui: {
			input: 'input',
			button: 'button',
		},

		initialize: function() {
			InputViewTypes = Marionette.FreeForm.InputViewTypes;

			var input = this.model.get('input');
			this.listenTo(input, 'change:value', this.onChangeInputValue);
		},

		onRender: function() {
			var input = this.model.get('input');
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
