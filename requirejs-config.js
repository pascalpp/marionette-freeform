(function(requirejs) {

	var config = {
		baseUrl: window.baseUrl,
		paths: {
			'jquery': 'bower_components/jquery/dist/jquery',
			'backbone': 'bower_components/backbone/backbone',
			'marionette': 'bower_components/marionette/lib/backbone.marionette',
			'underscore': 'bower_components/underscore/underscore',
			'mocha': 'bower_components/mocha/mocha',
			'chai': 'bower_components/chai/chai',
			'text': 'bower_components/requirejs-text/text'
		}
	}

	requirejs.config(config);
})(requirejs);
