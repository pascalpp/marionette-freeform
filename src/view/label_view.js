define(function(require) {
	'use strict';

	var Marionette = require('marionette');

	var LabelView = Marionette.ItemView.extend({

		tagName: 'label',

		className: function() {
			return this.options.className;
		},

		template: _.template('<%- label %>'),

		templateHelpers: function() {
			return {
				label: this.options.label
			};
		},

		attributes: function() {
			return {
				for: this.options.for
			};
		}

	});

	return LabelView;

});
