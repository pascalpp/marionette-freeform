/* global describe, it, expect, beforeEach */
/* jshint expr: true */
define(function(require) {
	'use strict';

	var ElementView = require('src/view/element_view');
	var elements = require('spec/helpers/element_types');

	describe('ElementView', function() {

		describe('with a non-Element model', function() {
			beforeEach(function() {
				this.error = null;
				this.model = new Backbone.Model({ type: 'text' });
				this.options = { model: this.model };
				try {
					this.element_view = new ElementView(this.options);
				} catch(e) {
					this.error = e;
				}
			});

			it('should throw an error', function() {
				expect(this.error).to.exist;
				expect(this.error.message).to.equal('ElementView requires an Element model.');
			});

		});


	});

});
