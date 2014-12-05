define(function(require) {
	'use strict';

	var InputAttributes = require('./input_attributes');

	var InputButtonView = Marionette.ItemView.extend({

		tagName: 'button',

		template: _.template('<%= label %>'),

		attribute_keys: ['type', 'id', 'name', 'disabled'],

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
