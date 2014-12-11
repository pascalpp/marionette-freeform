define(function(require) {
	'use strict';

	var BaseElement = require('./element.base');


	var SelectElement = BaseElement.extend({

		validateConstructor: function(attrs) {
			if (! attrs.values) throw new Error('Select Element requires a list of values.');

			// ensure that `values` is a collection
			if (_.isArray(attrs.values)) {
				attrs.values = new Backbone.Collection(attrs.values);
			}
			if (! (attrs.values instanceof Backbone.Collection)) {
				throw new Error('Select Element requires a list of values.');
			}
			return attrs;
		},

		initializeElement: function() {
			this.setSelectedOption();
			this.on('change:value', this.setSelectedOption);
		},

		setSelectedOption: function() {
			// set selected to true on first options with same value
			var values = this.get('values');
			values.each(function(value) {
				value.unset('selected');
			});
			var same_value = values.findWhere({ value: this.get('value') });
			if (same_value) same_value.set('selected', true);
		}

	});

	return SelectElement;

});