/* global describe, it, expect, beforeEach, testregion */
/* jshint expr: true */
define(function(require) {
	'use strict';

	var Element = require('src/model/element');
	var ElementView = require('src/view/element_view');

	describe('Required Checkbox', function() {

		beforeEach(function() {
			this.error = null;
			this.element = new Element({
				type: 'checkbox',
				checked: false,
				value: 'Some Value',
				label: 'Some Label',
				validator: function(value) {
					if (! this.get('checked')) {
						return 'This checkbox is required.';
					}
				}
			});
			this.sel = 'input[type=checkbox]';
			this.options = { model: this.element };
			this.view = new ElementView(this.options);
			testregion.show(this.view);
		});

		it('should contain a checkbox input', function() {
			expect(this.view.$(this.sel).length).to.equal(1);
		});
		it('should be unchecked initially', function() {
			expect(this.element.get('checked')).to.be.false;
			expect(this.view.$(this.sel).is(':checked')).to.be.false;
		});
		it('should set checked to true when clicked', function() {
			this.view.$(this.sel).trigger('click');
			expect(this.view.$(this.sel).is(':checked')).to.be.true;
			expect(this.element.get('checked')).to.be.true;
		});
		it('should show an error when unchecked', function() {
			// check it first
			this.view.$(this.sel).trigger('click');
			expect(this.view.$(this.sel).is(':checked')).to.be.true;
			expect(this.element.get('checked')).to.be.true;
			// then uncheck it
			this.view.$(this.sel).trigger('click');
			expect(this.view.$(this.sel).is(':checked')).to.be.false;
			expect(this.element.get('checked')).to.be.false;
			expect(this.view.$('label.error').length).to.equal(1);
			expect(this.view.$('label.error').text()).to.equal('This checkbox is required.');
		});
		it('should hide the error when checked again', function() {
			// check it first
			this.view.$(this.sel).trigger('click');
			expect(this.view.$(this.sel).is(':checked')).to.be.true;
			expect(this.element.get('checked')).to.be.true;
			// then uncheck it
			this.view.$(this.sel).trigger('click');
			expect(this.view.$(this.sel).is(':checked')).to.be.false;
			expect(this.element.get('checked')).to.be.false;
			expect(this.element.get('error')).to.exist;
			expect(this.view.$('label.error').length).to.equal(1);
			expect(this.view.$('label.error').text()).to.equal('This checkbox is required.');
			// then check it again
			this.view.$(this.sel).trigger('click');
			expect(this.view.$(this.sel).is(':checked')).to.be.true;
			expect(this.element.get('checked')).to.be.true;
			expect(this.element.get('error')).to.not.exist;
			expect(this.view.$('label.error').length).to.equal(0);
		});

	});

});
