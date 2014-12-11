define(function(require) {
	'use strict';

	var Marionette = require('marionette');
 	var BaseElement = require('./element.base');


	var ButtonfieldElement = BaseElement.extend({

		validateConstructor: function(attrs) {
			if (! attrs.input || ! attrs.button) {
				throw new Error('Buttonfield Element requires an input and a button.');
			}

			var Element = Marionette.FreeForm.Element;
			// ensure that `input` and `button` are Element models
			if (! (attrs.input instanceof BaseElement)) {
				attrs.input = new Element(attrs.input);
			}
			if (! (attrs.button instanceof BaseElement)) {
				attrs.button = new Element(attrs.button);
			}

			return attrs;
		},

		initializeElement: function() {
			var input = this.get('input');

			// set the input value to buttonfield's value
			input.set('value', this.get('value'));

			// update input value when buttonfield value changes
			this.on('change:value', function(model, value, options) {
				input.set('value', value);
			});

			// update buttonfield value with input value changes
			this.listenTo(input, 'change:value', function(model, value, options) {
				this.set('value', value);
			});
		},

	});

	return ButtonfieldElement;

});