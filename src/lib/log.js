define(function(require) {
	'use strict';

	var log = function(msg) {
		if (window.console) {
			console.log.apply(console, arguments);
		}
	};

	return log;

});
