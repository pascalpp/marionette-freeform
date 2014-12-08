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
			return this.model.pick(this.attribute_keys);
		},
	};

	return InputAttributes;

});
