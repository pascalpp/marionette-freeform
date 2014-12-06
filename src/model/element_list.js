define(function(require) {
	'use strict';

	var Element = require('./element');

	var ElementList = Backbone.Collection.extend({

		model: Element,

		initialize: function(models, options) {
			options = options || {};
			this.setRelatedModel(options.related_model);
		},

		setRelatedModel: function(model) {
			if (this.related_model === model) return;
			this.related_model = model;
			this.trigger('change:related_model', this, model);
		}

	});

	return ElementList;

});
