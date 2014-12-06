(function(requirejs) {

	var config = {
		baseUrl: window.baseUrl,
		paths: {
			'jquery': 'bower_components/jquery/dist/jquery',
			'backbone': 'bower_components/backbone/backbone',
			'marionette': 'bower_components/marionette/lib/backbone.marionette',
			'underscore': 'bower_components/underscore/underscore',
			'text': 'bower_components/requirejs-text/text',
			'mocha': 'node_modules/mocha/mocha',
			'chai': 'node_modules/chai/chai',
			'chai-jq': 'node_modules/chai-jq/chai-jq',
			'sinon': 'node_modules/sinon/pkg/sinon',
			'sinon-chai': 'node_modules/sinon-chai/lib/sinon-chai',

		}
	}

	requirejs.config(config);
})(requirejs);
