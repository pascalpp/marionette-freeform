define(function(require) {
	'use strict';

	var Element = require('model/element');


	var ElementList = Backbone.Collection.extend({
		model: Element,
		initialize: function(models, options) {
			options = options || {};
			this.related_model = options.related_model;
			delete options.related_model;
		}
	});

	return ElementList;

});
