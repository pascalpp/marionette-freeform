define(function(require) {
	'use strict';

	/* this modifies Backbone.Model.prototype to provide per-attribute validation */

	Backbone.Model.prototype.validate = function(attrs, options) {
		var invalid;
		_.each(_.keys(attrs), function(key) {
			if (invalid) return; // only return first error
			invalid = this.validateAttribute(key, attrs[key], options);
		}, this);
		return invalid;
	};

	Backbone.Model.prototype.validateAttribute = function(key, val, options) {
		options = options || {};
		var validator = this.validators && this.validators[key];
		if (_.isFunction(validator)) {
			return validator.call(this, val, options);
		}
	};

	Backbone.Model.prototype.validators = {};

});