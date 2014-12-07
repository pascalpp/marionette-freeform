define(function(require) {
	'use strict';

	var Backbone = require('backbone');

	/* base model with per-attribute validation */

	var validation_methods = {

		validate: function(attrs, options) {
			return this.validateAttributes(attrs, options);
		},

		validateAttributes: function(attrs, options) {
			var invalid;
			_.each(_.keys(attrs), function(key) {
				if (invalid) return; // only return first error
				invalid = this.validateAttribute(key, attrs[key], options);
			}, this);
			return invalid;
		},

		validateAttribute: function(key, val, options) {
			options = options || {};
			var validator = this.validators && this.validators[key];
			if (_.isFunction(validator)) {
				return validator.call(this, val, options);
			}
		}
	};

	var class_methods = {

		mixin: function(obj) {
			if (! obj) return;
			if (! obj.prototype) return;
			_.extend(obj.prototype, validation_methods);
		}

	};

	var Model = Backbone.Model.extend(validation_methods, class_methods);

	return Model;

});