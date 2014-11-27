define(function(require) {
	'use strict';

	/* this modifies Backbone.Model.prototype to provide per-attribute validation */

	Backbone.Model.prototype.validate = function(attrs) {
		var invalid;
		_.each(_.keys(attrs), function(key) {
			if (invalid) return; // only return first error
			invalid = this.validateAttribute(key, attrs[key]);
		}, this);
		return invalid;
	};

	Backbone.Model.prototype.validateAttribute = function(key, val) {
		var validator = this.validators && this.validators[key];
		if (_.isFunction(validator)) {
			return validator.call(this, val);
		}
	};

	Backbone.Model.prototype.validators = {};

});