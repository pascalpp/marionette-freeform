(function(requirejs) {
	/* global requirejs */
	'use strict';

	var config = {
		baseUrl: window.baseUrl,
		paths: {
			'jquery': 'bower_components/jquery/dist/jquery',
			'backbone': 'bower_components/backbone/backbone',
			'marionette': 'bower_components/marionette/lib/backbone.marionette',
			'underscore': 'bower_components/underscore/underscore',
			'text': 'bower_components/requirejs-text/text',
		},
		shim: {
			'src/lib/setPrefixedClassname': {
				deps: ['jquery']
			}
		}
	};

	requirejs.config(config);
})(requirejs);
