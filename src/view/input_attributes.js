define(function(require) {
	'use strict';

	/* mixin methods for auto-applying model keys as tag attributes */
	/* views with these methods can define an array called `attribute_keys` */

	var InputAttributes = {

		setAttributes: function() {
			var attributes = _.result(this, 'attributes');
			this.$el.attr(attributes);
		},

		attributes: function() {
			var attributes = {};
			_.each(this.attribute_keys, function(key) {
				attributes[key] = this.model.get(key);
			}, this);
			return attributes;
		},
	};

	return InputAttributes;

});
