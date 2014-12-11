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

	var simple_types = [
		'text',
		'password',
		'textarea',
	];

	describe('Simple InputViews', function() {

		_.each(simple_types, function(type) {
			elements.tested[type] = true;

			describe('InputView '+type, function() {
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

				it('should display the default model value', function() {
					testregion.show(this.view);
					expect(this.view.getInputValue()).to.equal(this.element.get('value'));
				});
				it('should display a different initial model value', function() {
					var initial_value = 'foo';
					this.element.set('value', initial_value);
					testregion.show(this.view);
					expect(this.view.getInputValue()).to.equal(initial_value);
				});
				it('should set model value when input value changes', function() {
					var default_value = this.element.get('value');
					var changed_value = 'foo';
					expect(default_value).to.not.equal(changed_value);
					testregion.show(this.view);
					this.view.setInputValue(changed_value);
					this.view.$el.trigger('change');
					expect(this.element.get('value')).to.equal(changed_value);
				});
				it('should update input value when model value changes', function() {
					testregion.show(this.view);
					var initial_value = this.view.getInputValue();
					var changed_value = 'foo';
					expect(initial_value).to.not.equal(changed_value);
					this.element.set('value', changed_value);
					expect(this.view.getInputValue()).to.equal(changed_value);
				});

			});

		});

	});

});
