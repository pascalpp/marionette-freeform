/* global describe, it, expect, beforeEach, testregion */
/* jshint expr: true */
define(function(require) {
	'use strict';

	var Backbone = require('backbone');
	var InputViewTypes = require('src/view/input_view_types');
	var Element = require('src/model/element');
	var elements = require('spec/helpers/element_types');
	var clone = require('spec/helpers/clone');
	var log = require('src/lib/log'); /* jshint ignore: line */
	require('spec/helpers/jquery_attr');

	var checked_types = [
		'checkbox',
		'radio'
	];

	describe('Checked InputViews', function() {

		_.each(checked_types, function(type) {
			elements.tested[type] = true;

			beforeEach(function() {
				// cloning because some tests modify these options
				// so each test needs its own copy of this.options
				this.options = clone(elements.index[type]);
				this.element = new Element(this.options);
				this.View = InputViewTypes[type];
				this.view = new this.View({ model: this.element });
			});

			it('should have a getInputValue method', function() {
				expect(this.view.getInputValue).to.exist;
				expect(_.isFunction(this.view.getInputValue)).to.be.true;
			});
			it('should have a setInputValue method', function() {
				expect(this.view.setInputValue).to.exist;
				expect(_.isFunction(this.view.setInputValue)).to.be.true;
			});

			if (type === 'checkbox') {
				describe('checkbox behavior', function() {
					beforeEach(function() {
						this.element_options = clone(elements.index[type]);
						this.element = new Element(this.element_options);
						this.view_options = {
							model: this.element
						};
						this.View = InputViewTypes[type];
						this.view = new this.View(this.view_options);
					});

					it('should be checked initially if checked is true', function() {
						this.element.set('checked', true);
						this.view = new this.View(this.view_options);
						testregion.show(this.view);
						expect(this.view.$el.is(':checked')).to.be.true;
					});
					it('should not be checked initially if checked is false', function() {
						this.element.set('checked', false);
						this.view = new this.View(this.view_options);
						testregion.show(this.view);
						expect(this.view.$el.is(':checked')).to.be.false;
					});
					it('should not be checked initially if checked is undefined', function() {
						this.element.unset('checked');
						this.view = new this.View(this.view_options);
						testregion.show(this.view);
						expect(this.view.$el.is(':checked')).to.be.false;
					});
					it('getInputValue should return its value if checked', function() {
						this.element.set('checked', true);
						this.element.set('value', 'pizza');
						this.view = new this.View(this.view_options);
						testregion.show(this.view);
						expect(this.view.getInputValue()).to.equal('pizza');
					});
					it('getInputValue should return nothing if unchecked', function() {
						this.element.set('checked', false);
						this.element.set('value', 'pizza');
						this.view = new this.View(this.view_options);
						testregion.show(this.view);
						expect(this.view.getInputValue()).to.not.equal('pizza');
						expect(this.view.getInputValue()).to.not.exist;
					});
					it('should be checked when clicked', function() {
						testregion.show(this.view);
						// click it once
						this.view.$el.trigger('click');
						expect(this.view.$el.is(':checked')).to.be.true;
					});
					it('should be unchecked when clicked twice', function() {
						testregion.show(this.view);
						// click it once
						this.view.$el.trigger('click');
						this.view.$el.trigger('click');
						expect(this.view.$el.is(':checked')).to.be.false;
					});
					it('should be checked when clicked thrice', function() {
						this.view.$el.trigger('click');
						this.view.$el.trigger('click');
						this.view.$el.trigger('click');
						expect(this.view.$el.is(':checked')).to.be.true;
					});

				});

			} else if (type === 'radio') {
				describe('radio behavior', function() {
					beforeEach(function() {
						this.element_options = clone(elements.index[type]);
						this.element = new Element(this.element_options);
						this.view_options = {
							model: this.element
						};
						this.View = InputViewTypes[type];
					});

					it('should be checked initially if checked is true', function() {
						this.element.set('checked', true);
						this.view = new this.View(this.view_options);
						testregion.show(this.view);
						expect(this.view.$el.is(':checked')).to.be.true;
					});
					it('should not be checked initially if checked is false', function() {
						this.element.set('checked', false);
						this.view = new this.View(this.view_options);
						testregion.show(this.view);
						expect(this.view.$el.is(':checked')).to.be.false;
					});
					it('should not be checked initially if checked is undefined', function() {
						this.element.unset('checked');
						this.view = new this.View(this.view_options);
						testregion.show(this.view);
						expect(this.view.$el.is(':checked')).to.be.false;
					});
					it('getInputValue should return its value if checked', function() {
						this.element.set('checked', true);
						this.element.set('value', 'pizza');
						this.view = new this.View(this.view_options);
						testregion.show(this.view);
						expect(this.view.getInputValue()).to.equal('pizza');
					});
					it('getInputValue should return nothing if unchecked', function() {
						this.element.set('checked', false);
						this.element.set('value', 'pizza');
						this.view = new this.View(this.view_options);
						testregion.show(this.view);
						expect(this.view.getInputValue()).to.not.equal('pizza');
						expect(this.view.getInputValue()).to.not.exist;
					});
					it('should set checked to true when clicked', function() {
						this.element.set('checked', false);
						this.view = new this.View(this.view_options);
						testregion.show(this.view);
						this.view.$el.click();
						expect(this.element.get('checked')).to.be.true;
					});
					it('should set checked to false when a different radio is clicked', function() {
						this.element.set('checked', true);
						this.view = new this.View(this.view_options);
						testregion.show(this.view);
						var other_element = new Element(clone(elements.index[type]));
						other_element.set('value', 'other_value');
						other_element.set('checked', false);
						other_element.set('name', this.element.get('name'));
						var other_options = { model: other_element };
						var other_view = new this.View(other_options);
						testregion.$el.append(other_view.render().el);
						other_view.$el.trigger('click');
						expect(other_element.get('checked')).to.be.true;
						expect(this.element.get('checked')).to.be.false;
					});
				});

			}

		});

	});

});
