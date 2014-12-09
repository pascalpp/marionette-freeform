/* global mocha, chai, sinon, before, beforeEach, afterEach, after, Marionette */
define(function(require) {
	'use strict';

	require('src/freeform');

	window.expect = chai.expect;

	mocha.setup('bdd');

	// add a colon to all descriptions for better URL grepping
	var original_describe = describe;
	describe = function(description, callback) {
		original_describe.apply(original_describe, ['· '+description+':', callback]);
	};

	mocha.loaded = function() {
		var $testregion = $('#test-region');
		window.testregion = new Marionette.Region({
			el: $testregion
		});

		mocha.checkLeaks();
		mocha.run();

		var $fixtures = $('#fixtures');
		var $stats = $('#mocha-stats');
		var $pending;

		var setFixtures = function () {
			_.each(arguments, function (content) {
				$fixtures.append(content);
			});
		};

		var clearFixtures = function () {
			$fixtures.empty();
		};

		var markFailed = function() {
			var count = + $stats.find('.failures em').text();
			if (count > 0) $stats.addClass('failed');
		};

		var showPending = function() {
			var count = $('.test.pending').length;
			$pending = $stats.find('li.pending');
			if (! $pending.length) {
				$pending = $('<li class="pending">pending: <em></em></li>').addClass('pending');
				$stats.find('li.failures').after($pending);
			}
			$pending.find('em').text(count);
			if (count > 0) {
				$stats.addClass('pending');
			}
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
			markFailed();
			showPending();
		});

		after(function() {
			showPending();
			$stats.find('.progress').on('click', function() {
				var url = window.location.href.replace(/\/spec\/?.*/,'/spec');
				window.location = url;
			});
			$stats.find('li a').contents().unwrap();
			$stats.find('.passes').on('click', function() {
				$('#mocha-report li.suite, li.test').hide();
				$('#mocha-report li.test.pass').each(function() {
					$(this).show().parents('li.suite').show();
				});
			});
			$stats.find('.failures').on('click', function() {
				$('#mocha-report li.suite, li.test').hide();
				$('#mocha-report li.test.fail').each(function() {
					$(this).show().parents('li.suite').show();
				});
			});
			$stats.find('.pending').on('click', function() {
				$('#mocha-report li.suite, li.test').hide();
				$('#mocha-report li.test.pending').each(function() {
					$(this).show().parents('li.suite').show();
				});
			});
		});
	};

});