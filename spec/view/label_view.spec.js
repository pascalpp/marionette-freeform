/* global describe, it, expect, beforeEach */
/* jshint expr: true */
define(function(require) {
	'use strict';

	var LabelView = require('src/view/label_view');

	describe('LabelView', function() {

		describe('when used to show labels', function() {
			beforeEach(function() {
				this.options = {
					for: 'my_element_id',
					label: 'Some label.',
					className: 'error'
				};
				this.view = new LabelView(this.options);
				this.view.render();
			});

			it('should exist', function() {
				expect(this.view).to.exist;
			});
			it('should have the correct ‘for’ attribute', function() {
				expect(this.view.$el.attr('for')).to.equal('my_element_id');
				expect(this.view.$el.prop('for')).to.equal('my_element_id');
			});
			it('should have the correct classname', function() {
				expect(this.view.$el.hasClass('error')).to.be.true;
			});
			it('should display the given error message', function() {
				expect(this.view.$el.text()).to.equal('Some label.');
			});

			describe('with a custom error class', function() {
				beforeEach(function() {
					this.options.className = 'custom_error';
					this.view = new LabelView(this.options);
					this.view.render();
				});

				it('should have the custom classname', function() {
					expect(this.view.$el.hasClass('custom_error')).to.be.true;
				});
				it('should not have the default classname', function() {
					expect(this.view.$el.hasClass('error')).to.be.false;
				});
			});

			describe('with a non-html-safe error message', function() {
				beforeEach(function() {
					this.options.label = '<script>alert("xss")</script>';
					this.view = new LabelView(this.options);
					this.view.render();
				});

				it('should convert unsafe characters to html entities', function() {
					expect(this.view.$el.html()).to.equal('&lt;script&gt;alert("xss")&lt;/script&gt;');
				});

			});

		});

		describe('when used to show errors', function() {
			beforeEach(function() {
				this.options = {
					for: 'my_element_id',
					label: 'Error message.',
					className: 'error'
				};
				this.error_view = new LabelView(this.options);
				this.error_view.render();
			});

			it('should exist', function() {
				expect(this.error_view).to.exist;
			});
			it('should have the correct ‘for’ attribute', function() {
				expect(this.error_view.$el.attr('for')).to.equal('my_element_id');
				expect(this.error_view.$el.prop('for')).to.equal('my_element_id');
			});
			it('should have the correct classname', function() {
				expect(this.error_view.$el.hasClass('error')).to.be.true;
			});
			it('should display the given error message', function() {
				expect(this.error_view.$el.text()).to.equal('Error message.');
			});

			describe('with a custom error class', function() {
				beforeEach(function() {
					this.options.className = 'custom_error';
					this.error_view = new LabelView(this.options);
					this.error_view.render();
				});

				it('should have the custom classname', function() {
					expect(this.error_view.$el.hasClass('custom_error')).to.be.true;
				});
				it('should not have the default classname', function() {
					expect(this.error_view.$el.hasClass('error')).to.be.false;
				});
			});

			describe('with a non-html-safe error message', function() {
				beforeEach(function() {
					this.options.label = '<script>alert("xss")</script>';
					this.error_view = new LabelView(this.options);
					this.error_view.render();
				});

				it('should convert unsafe characters to html entities', function() {
					expect(this.error_view.$el.html()).to.equal('&lt;script&gt;alert("xss")&lt;/script&gt;');
				});

			});

		});
	});

});
