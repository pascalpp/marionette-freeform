define(function(require) {

	require('marionette');
	require('mocha');
	var chai = require('chai');
	var sinon = require('sinon');

	mocha.setup('bdd');

	window.expect = chai.expect;
	window.sinon = sinon;

	mocha.loaded = function() {
		mocha.checkLeaks();
		mocha.run();

		var $fixtures = $('#fixtures');

		var setFixtures = function () {
			_.each(arguments, function (content) {
				$fixtures.append(content);
			});
		};

		var clearFixtures = function () {
			$fixtures.empty();
		};

		var originalHash = window.location.hash;

		before(function() {
			this.setFixtures = setFixtures;
			this.clearFixtures = clearFixtures;
		});

		beforeEach(function () {
			this.sinon = sinon.sandbox.create();
		});

		afterEach(function () {
			this.sinon.restore();
			this.clearFixtures();
			window.location.hash = originalHash;
			Backbone.history.stop();
			Backbone.history.handlers.length = 0;
		});
	};



});