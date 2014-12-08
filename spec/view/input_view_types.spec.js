/* global describe, it, expect, beforeEach */
/* jshint expr: true */
define(function(require) {
	'use strict';

	var Backbone = require('backbone');
	var InputViewTypes = require('src/view/input_view_types');
	var Element = require('src/model/element');
	var elements = require('spec/helpers/element_types');
	require('spec/helpers/jquery_attr');


	var button_elements = ['submit', 'reset', 'button', 'buttonset', 'buttonfield'];

	describe('InputViewTypes', function() {

		it('should have the same number of items as elements test helper', function() {
			expect(_.keys(InputViewTypes).length).to.equal(elements.types.length);
		});

		_.each(elements.types, function(type) {
			describe('InputViewType '+type, function() {
				describe('View class', function() {
					beforeEach(function() {
						this.options = elements.index[type];
						this.element = new Element(this.options);
						this.View = InputViewTypes[type];
					});

					it('should exist', function() {
						expect(this.View).to.exist;
					});
					it('should throw an error when instantiated with a non-Element model', function() {
						var error;
						var view;
						var model = new Backbone.Model(this.element.attributes);
						var options = { model: model };
						try {
							view = new this.View(options);
						} catch(e) {
							error = e;
						}
						expect(error).to.exist;
						expect(view).to.not.exist;
					});
				});
				describe('view instance', function() {
					beforeEach(function() {
						this.options = elements.index[type];
						this.element = new Element(this.options);
						this.View = InputViewTypes[type];
						this.view = new this.View({ model: this.element });
						this.view.render();
					});
					it('should exist', function() {
						expect(this.view).to.exist;
					});
					it('should have default attributes', function() {
						// this test relies on a modification to jquery.attr
						// see spec/helpers/jquery_attr
						var attributes = this.view.$el.attr();
						var default_attributes = elements.default_attributes[type];
						expect(default_attributes).to.exist;
						expect(_.isArray(default_attributes)).to.be.true;
						_.each(_.keys(attributes), function(key) {
							expect(_.contains(default_attributes, key)).to.be.true;
						});
					});
					it('should allow all supported attributes', function() {
						var supported_attributes = elements.supported_attributes[type];
						expect(supported_attributes).to.exist;
						expect(_.isArray(supported_attributes)).to.be.true;
						_.each(supported_attributes, function(key) {
							this.options[key] = elements.getValidAttributeValue(key, type);
						}, this);
						this.element = new Element(this.options);
						this.view = new this.View({ model: this.element });
						this.view.render();
						var attributes = this.view.$el.attr();
						_.each(_.keys(attributes), function(key) {
							expect(_.contains(supported_attributes, key)).to.be.true;
						});
					});
					it('should ignore unsupported attributes', function() {
						var supported_attributes = elements.supported_attributes[type];
						expect(supported_attributes).to.exist;
						expect(_.isArray(supported_attributes)).to.be.true;
						_.each(supported_attributes, function(key) {
							this.options[key] = elements.getValidAttributeValue(key, type);
						}, this);
						this.options['foo_unsupported'] = 'bar_unsupported';
						this.element = new Element(this.options);
						// verify that element has our weird value
						expect(this.element.get('foo_unsupported')).to.equal('bar_unsupported');
						this.view = new this.View({ model: this.element });
						this.view.render();
						// checking this three different ways : )
						expect(this.view.$el.attr('foo_unsupported')).to.not.exist;
						expect(this.view.$el.prop('foo_unsupported')).to.not.exist;
						var attrs = _.keys(this.view.$el.attr());
						expect(_.contains(attrs, 'foo_unsupported')).to.be.false;

					});
					if (! _.contains(button_elements, type)) {
						it('should have a getInputValue method', function() {
							expect(this.view.getInputValue).to.exist;
							expect(_.isFunction(this.view.getInputValue)).to.be.true;
						});
						it('should have a setInputValue method', function() {
							expect(this.view.setInputValue).to.exist;
							expect(_.isFunction(this.view.setInputValue)).to.be.true;
						});
						it('should display the default model value', function() {
							this.view.render();
							expect(this.view.getInputValue()).to.equal(this.element.get('value'));
						});
						it('should display a different initial model value', function() {
							var initial_value = 'foo';
							if (type === 'checkbox') {
								initial_value = true;
							}
							this.element.set('value', initial_value);
							this.view.render();
							expect(this.view.getInputValue()).to.equal(initial_value);
						});
						it('should set model value when input value changes', function() {
							var default_value = this.element.get('value');
							var changed_value = 'foo';
							if (type === 'checkbox') {
								changed_value = true;
							}
							expect(default_value).to.not.equal(changed_value);
							this.view.render();
							this.view.setInputValue(changed_value);
							this.view.$el.trigger('change');
							expect(this.element.get('value')).to.equal(changed_value);
						});
						it('should update input value when model value changes', function() {
							this.view.render();
							var initial_value = this.view.getInputValue();
							var changed_value = 'foo';
							if (type === 'checkbox') {
								changed_value = true;
							}
							expect(initial_value).to.not.equal(changed_value);
							this.element.set('value', changed_value);
							expect(this.view.getInputValue()).to.equal(changed_value);
						});
					}
				});
			});

		});

	});

});
