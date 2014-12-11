define(function(require) {
	'use strict';

	var Marionette = require('marionette');
	var Element = require('src/model/element.base');
	var InputButtonView = require('./input_button_view');


	var InputButtonsetView = Marionette.CollectionView.extend({
		tagName: 'span',

		childView: InputButtonView,

		constructor: function(options) {
			Marionette.CollectionView.call(this, options);

			// validate model
			if (! (this.model instanceof Element)) throw new Error('InputView requires an Element model.');

			// use model's buttons as this.collection
			this.collection = this.model.get('buttons');

			// listen for external changes to the model
			this.listenTo(this.model, 'change:value', this.onModelChangeValue);

			// these steps allow the view to consume an existing dom element
			var className = this.model.get('className');
			if (className) this.$el.addClass(className);
		},

	});

	return InputButtonsetView;

});
