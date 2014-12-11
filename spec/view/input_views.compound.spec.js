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

	var compound_types = [];


	describe('Compound InputViews', function() {

		_.each(compound_types, function(type) {
			elements.tested[type] = true;

			describe('InputViewType '+type, function() {
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
					if (! _.contains(non_value_elements, type)) {
						it('should have a getInputValue method', function() {
							expect(this.view.getInputValue).to.exist;
							expect(_.isFunction(this.view.getInputValue)).to.be.true;
						});
						it('should have a setInputValue method', function() {
							expect(this.view.setInputValue).to.exist;
							expect(_.isFunction(this.view.setInputValue)).to.be.true;
						});

						if (type === 'checkbox' ) {
							describe('checkbox behavior', function() {
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

							});

						} else if (type === 'radio' ) {
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

						} else {
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

							if (type === 'select') {
								it('should add option nodes when values are added to values collection', function() {
									testregion.show(this.view);
									var values = this.element.get('values');
									var length = values.length;
									values.add({ value:'dark', 'label':'Dark' });
									expect(values.length).to.equal(length + 1);
									expect(this.view.$('option').length).to.equal(values.length);
								});
								it('should remove option nodes when values are removed from values collection', function() {
									testregion.show(this.view);
									var values = this.element.get('values');
									var length = values.length;
									values.remove(values.last());
									expect(values.length).to.equal(length - 1);
									expect(this.view.$('option').length).to.equal(values.length);
								});
								it('should retain placeholder when values collection is emptied');
							}

						}


					}
				});
			});

		});

	});

});
