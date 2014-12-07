define(function(require) {
	'use strict';

	var Marionette = require('marionette');
	var InputAttributes = require('./input_attributes');


	var InputButtonView = Marionette.ItemView.extend({

		tagName: 'button',

		template: _.template('<%= label %>'),

		attribute_keys: ['type', 'id', 'name', 'disabled'],

		constructor: function() {
			Marionette.ItemView.apply(this, arguments);

			// these steps allow the view to consume an existing dom element
			this.listenTo(this, 'render', this.setAttributes);
			var className = this.model.get('className');
			if (className) this.$el.addClass(className);
		},

		triggers: function() {
			var triggers = {},
				trigger = this.model.get('trigger');

			if (trigger) {
				triggers['click'] = {
					event: trigger,
					preventDefault: false,
					stopPropagation: false
				};
			}

			return triggers;
		},

	});

	// apply methods from InputAttributes mixin
	_.extend(InputButtonView.prototype, InputAttributes);

	return InputButtonView;

});
