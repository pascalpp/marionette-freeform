define(function(require) {
	'use strict';

	var ErrorView = Marionette.ItemView.extend({
		tagName: 'label',
		className: function() {
			return this.options.className || 'error';
		},
		template: _.template('{{ data.error }}'),
		templateHelpers: function() {
			return {
				error: this.options.error
			};
		},
		attributes: function() {
			return {
				for: this.options.for
			};
		}
	});

	return ErrorView;

});
