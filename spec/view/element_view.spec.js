/* global describe, it, expect, beforeEach */
/* jshint expr: true */
define(function(require) {
	'use strict';

	var Element = require('src/model/element');
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

			it('should not exist', function() {
				expect(this.element_view).to.not.exist;
			});
			it('should throw an error', function() {
				expect(this.error).to.exist;
				expect(this.error.message).to.equal('ElementView requires an Element model.');
			});

		});

		describe('with an Element model', function() {
			beforeEach(function() {
				this.error = null;
				this.model = new Element({ type: 'text' });
				this.options = { model: this.model };
				try {
					this.element_view = new ElementView(this.options);
					this.element_view.render();
				} catch(e) {
					this.error = e;
				}
			});

			it('should exist', function() {
				expect(this.element_view).to.exist;
			});
			it('should not throw an error', function() {
				expect(this.error).to.be.null;
			});
			it('should set the default element className on itself', function() {
				expect('TODO').to.not.exist;
			});
			it('should set a custom className on itself', function() {
				expect('TODO').to.not.exist;
			});
			it('should set a classname on itself matching the element type', function() {
				_.each(elements.types, function(type) {
					var element = new Element({ type: type });
					var options = { model: element };
					var element_view = new ElementView(options);
					element_view.render();
					expect(element_view.$el).to.exist;
					expect(element_view.$el.hasClass('type-'+type)).to.be.true;
				});
			});
			it('should set classname `type-button` on itself for a submit element', function() {
				expect(this.element_view.$el.hasClass('type-button')).to.be.true;
			});
			it('should contain an html input matching its element type', function() {
				expect('TODO').to.not.exist;
			});

			describe('when the element has an error', function() {
				it('should set an error class on itself', function() {
					expect('TODO').to.not.exist;
				});
				it('should show an error in the DOM', function() {
					expect('TODO').to.not.exist;
				});
				describe('when the element error is removed', function() {
					it('should remove the error class from itself', function() {
						expect('TODO').to.not.exist;
					});
					it('should remove the error from the DOM', function() {
						expect('TODO').to.not.exist;
					});
				});
			});


		});


	});

});
