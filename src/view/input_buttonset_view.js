define(function(require) {
	'use strict';

	var InputButtonView = require('./input_button_view'),
		ElementList	= require('model/element_list');


	var InputButtonsetView = Marionette.CollectionView.extend({
		tagName: 'span',

		childView: InputButtonView,

		constructor: function(options) {
			Marionette.CollectionView.call(this, options);

			// convert model's `buttons` attribute to a collection
			this.collection = this.model.get('buttons');
			if (_.isArray(this.collection)) {
				this.collection = new ElementList(this.collection);
			}
			if (! (this.collection instanceof ElementList)) {
				throw new Error('InputButtonsetView requires an array or ElementList of buttons.');
			}

			// listen for external changes to the model
			this.listenTo(this.model, 'change:value', this.onModelChangeValue);

			// these steps allow the view to consume an existing dom element
			var className = this.model.get('className');
			if (className) this.$el.addClass(className);
		},

	});

	return InputButtonsetView;

});
