define(function(require) {
	'use strict';

	var clone = function(obj) {
		var cloned = JSON.parse(JSON.stringify(obj));
		return cloned;
	};

	return clone;

});
