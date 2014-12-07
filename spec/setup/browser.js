/* global mocha, chai, sinon, before, beforeEach, afterEach, after */
define(function(require) {
	'use strict';

	require('marionette');

	window.expect = chai.expect;

	mocha.setup('bdd');

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

		after(function() {
			var stats = $('#mocha-stats');
			var count = + stats.find('.failures em').text();
			if (count > 0) stats.addClass('failed');
			stats.find('.progress').on('click', function() {
				window.location = '/spec/';
			});

			stats.show();

		});
	};



});