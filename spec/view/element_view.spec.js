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
				var element = new Element({ type: 'text' });
				var options = { model: element };
				var element_view = new ElementView(options);
				element_view.render();
				expect(element_view.$el).to.exist;
				expect(element_view.$el.hasClass('element')).to.be.true;
			});
			it('should set a custom className on itself', function() {
				var element = new Element({ type: 'text' });
				var options = { model: element, className: 'foo' };
				var element_view = new ElementView(options);
				element_view.render();
				expect(element_view.$el).to.exist;
				expect(element_view.$el.hasClass('element')).to.be.false;
				expect(element_view.$el.hasClass('foo')).to.be.true;
			});
			it('should set a classname on itself matching the element type', function() {
				// this test is performed on every element type
				_.each(elements.types, function(type) {
					var element = new Element(elements.index[type]);
					var options = { model: element };
					var element_view = new ElementView(options);
					element_view.render();
					expect(element_view.$el).to.exist;
					expect(element_view.$el.hasClass('type-'+type)).to.be.true;
				});
			});
			it('should set classname ‘type-button’ on itself for a submit element', function() {
				var element = new Element({ type: 'submit' });
				var options = { model: element };
				var element_view = new ElementView(options);
				element_view.render();
				expect(element_view.$el).to.exist;
				expect(element_view.$el.hasClass('type-button')).to.be.true;
			});
			it('should set classname ‘type-button’ on itself for a reset element', function() {
				var element = new Element({ type: 'reset' });
				var options = { model: element };
				var element_view = new ElementView(options);
				element_view.render();
				expect(element_view.$el).to.exist;
				expect(element_view.$el.hasClass('type-button')).to.be.true;
			});
			it('should contain an html input matching its element type', function() {
				// this test is performed on every element type
				_.each(elements.types, function(type) {
					var count = 1;
					if (type === 'buttonset') count = 3; // test data for buttonset has 3 buttons
					var element = new Element(elements.index[type]);
					var options = { model: element };
					var element_view = new ElementView(options);
					element_view.render();
					expect(element_view.$).to.exist;
					expect(elements.selectors[type]).to.exist;
					var $input = element_view.$(elements.selectors[type]);
					expect($input).to.exist;
					expect($input.length).to.equal(count);
				});
			});

			describe('when the element has an error', function() {
				beforeEach(function() {
					this.element = new Element({
						type: 'text',
						validator: function(value) {
							if (value === 'foo') return 'Invalid foo message.';
						}
					});
					this.options = { model: this.element };
				});
				it('should set the default error class on itself', function() {
					var default_error_class = 'element-error';
					var element_view = new ElementView(this.options);
					element_view.render();
					expect(element_view.$el.hasClass(default_error_class)).to.be.false;
					this.element.set('value', 'foo');
					expect(element_view.$el.hasClass(default_error_class)).to.be.true;
				});
				it('should set a custom error class on itself', function() {
					var default_error_class = 'element-error';
					var custom_error_class = 'myelement-myerror';
					this.options.className = 'myelement';
					this.element.set('error_class', 'myerror');
					var element_view = new ElementView(this.options);
					element_view.render();
					expect(element_view.$el.hasClass(default_error_class)).to.be.false;
					expect(element_view.$el.hasClass(custom_error_class)).to.be.false;
					this.element.set('value', 'foo');
					expect(element_view.$el.hasClass(default_error_class)).to.be.false;
					expect(element_view.$el.hasClass(custom_error_class)).to.be.true;
				});
				it('should show the error message in a label with the default error class', function() {
					var default_error_selector = 'label.error';
					var element_view = new ElementView(this.options);
					element_view.render();
					expect(element_view.$(default_error_selector).length).to.equal(0);
					this.element.set('value', 'foo');
					expect(element_view.$(default_error_selector).length).to.equal(1);
					expect(element_view.$(default_error_selector).text()).to.equal('Invalid foo message.');
				});
				it('should show the error message in a label with a custom error class', function() {
					var default_error_selector = 'label.error';
					var custom_error_selector = 'label.myerror';
					this.element.set('error_class', 'myerror');
					var element_view = new ElementView(this.options);
					element_view.render();
					expect(element_view.$(default_error_selector).length).to.equal(0);
					expect(element_view.$(custom_error_selector).length).to.equal(0);
					this.element.set('value', 'foo');
					expect(element_view.$(default_error_selector).length).to.equal(0);
					expect(element_view.$(custom_error_selector).length).to.equal(1);
					expect(element_view.$(custom_error_selector).text()).to.equal('Invalid foo message.');
				});
				describe('when the element is valid again', function() {
					beforeEach(function() {
						this.element_view = new ElementView(this.options);
						this.element_view.render();
						this.element.set('value', 'foo');
					});
					it('should remove the default error class from itself', function() {
						var default_error_class = 'element-error';
						expect(this.element_view.$el.hasClass(default_error_class)).to.be.true;
						this.element.set('value', 'bar');
						expect(this.element_view.$el.hasClass(default_error_class)).to.be.false;
					});
					it('should remove the default error label from the DOM', function() {
						var default_error_selector = 'label.error';
						expect(this.element_view.$(default_error_selector).length).to.equal(1);
						this.element.set('value', 'bar');
						expect(this.element_view.$(default_error_selector).length).to.equal(0);
					});

					it('should remove a custom error class from itself', function() {
						var default_error_class = 'element-error';
						var custom_error_class = 'myelement-myerror';
						var element = new Element({
							type: 'text',
							error_class: 'myerror',
							validator: function(value) {
								if (value === 'foo') return 'Invalid foo message.';
							}
						});
						var options = {
							model: element,
							className: 'myelement'
						};
						var element_view = new ElementView(options);
						element_view.render();
						element.set('value', 'foo');
						expect(element_view.$el.hasClass(default_error_class)).to.be.false;
						expect(element_view.$el.hasClass(custom_error_class)).to.be.true;
						element.set('value', 'bar');
						expect(element_view.$el.hasClass(default_error_class)).to.be.false;
						expect(element_view.$el.hasClass(custom_error_class)).to.be.false;
					});
					it('should remove a custom error label from the DOM', function() {
						var default_error_selector = 'label.error';
						var custom_error_selector = 'label.myerror';
						var element = new Element({
							type: 'text',
							error_class: 'myerror',
							validator: function(value) {
								if (value === 'foo') return 'Invalid foo message.';
							}
						});
						var options = {
							model: element,
							className: 'myelement'
						};
						var element_view = new ElementView(options);
						element_view.render();
						element.set('value', 'foo');
						expect(element_view.$(default_error_selector).length).to.equal(0);
						expect(element_view.$(custom_error_selector).length).to.equal(1);
						element.set('value', 'bar');
						expect(element_view.$(default_error_selector).length).to.equal(0);
						expect(element_view.$(custom_error_selector).length).to.equal(0);
					});

				});
			});


		});


	});

});
