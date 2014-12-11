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

	describe('All InputViews', function() {

		it('should have the same number of items as elements test helper', function() {
			expect(_.keys(InputViewTypes).length).to.equal(elements.types.length);
		});

		_.each(elements.types, function(type) {
			describe('InputView '+type, function() {
				describe('View class', function() {
					beforeEach(function() {
						// cloning because some tests modify these options
						// so each test needs its own copy of this.options
						this.options = clone(elements.index[type]);
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
						// cloning because some tests modify these options
						// so each test needs its own copy of this.options
						this.options = clone(elements.index[type]);
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
						var attributes = _.keys(this.view.$el.attr());
						var default_attributes = elements.default_attributes[type];
						expect(default_attributes).to.exist;
						expect(_.isArray(default_attributes)).to.be.true;
						_.each(attributes, function(key) {
							expect(_.contains(default_attributes, key)).to.be.true;
						});
					});
					it('should allow all supported attributes', function() {
						var supported_attributes = elements.supported_attributes[type];
						expect(supported_attributes).to.exist;
						expect(_.isArray(supported_attributes)).to.be.true;
						_.each(supported_attributes, function(key) {
							var option = key;
							if (key === 'class') option = 'className';
							this.options[option] = elements.getValidAttributeValue(key, type);
						}, this);
						this.element = new Element(this.options);
						this.view = new this.View({ model: this.element });
						testregion.show(this.view);
						var attributes = _.keys(this.view.$el.attr());
						_.each(supported_attributes, function(key) {
							expect(_.contains(attributes, key)).to.be.true;
						});
					});
					it('should ignore unsupported attributes', function() {
						var supported_attributes = elements.supported_attributes[type];
						expect(supported_attributes).to.exist;
						expect(_.isArray(supported_attributes)).to.be.true;
						_.each(supported_attributes, function(key) {
							var option = key;
							if (key === 'class') option === 'className';
							this.options[option] = elements.getValidAttributeValue(key, type);
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
				});
			});
		});
	});

});
