/* global describe, it, expect, beforeEach */
/* jshint expr: true */
define(function(require) {
	'use strict';

	var Model = require('src/model/model');
	var Element = require('src/model/element');
	var ElementList = require('src/model/element_list');
	var elements = require('spec/helpers/element_types');

	describe('ElementList', function() {

		describe('with an array of every type of element', function() {
			beforeEach(function() {
				this.error = null;
				try {
					this.element_list = new ElementList(elements.objects);
				} catch(e) {
					this.error = e;
				}
			});

			it('should not throw an error', function() {
				expect(this.error).to.be.null;
			});

			it('should have the same length', function() {
				expect(this.element_list.length).to.equal(elements.objects.length);
			});

			it('each model should be an Element', function() {
				this.element_list.each(function(model) {
					expect(model instanceof Element).to.be.true;
				});
			});

		});

		describe('with one bad apple', function() {
			beforeEach(function() {
				this.error = null;
				try {
					this.element_list = new ElementList(elements.objects.concat({ type: null }));
				} catch(e) {
					this.error = e;
				}
			});

			it('should not exist', function() {
				expect(this.element_list).to.not.exist;
			});
			it('should throw an error', function() {
				expect(this.error).to.exist;
				expect(this.error.message).to.equal('Element requires a type.');
			});

		});

		describe('with a related model', function() {
			beforeEach(function() {
				this.error = null;

				this.elements = [
					{ type: 'text', related_key: 'foo' },
					{ type: 'text', related_key: 'bar' },
					{ type: 'text', value: 'unchanged value' },
				];
				this.related_model = new Model({
					foo: 'related_foo_value',
					bar: 'related_bar_value'
				});
				this.new_related_model = new Model({
					foo: 'new_related_foo_value',
					bar: 'new_related_bar_value'
				});

				this.options = {
					related_model: this.related_model
				};
				try {
					this.element_list = new ElementList(this.elements, this.options);
				} catch(e) {
					this.error = e;
				}
			});

			it('should exist', function() {
				expect(this.element_list).to.exist;
			});

			it('should not throw an error', function() {
				expect(this.error).to.be.null;
			});

			it('models should get values from related model', function() {
				expect(this.element_list.at(0).get('value')).to.equal('related_foo_value');
				expect(this.element_list.at(1).get('value')).to.equal('related_bar_value');
				expect(this.element_list.at(2).get('value')).to.equal('unchanged value');
			});

			describe('when related model changes', function() {
				it('models should update their values', function() {
					expect(this.element_list.at(0).get('value')).to.equal('related_foo_value');
					expect(this.element_list.at(1).get('value')).to.equal('related_bar_value');
					expect(this.element_list.at(2).get('value')).to.equal('unchanged value');
					this.element_list.setRelatedModel(this.new_related_model);
					expect(this.element_list.at(0).get('value')).to.equal('new_related_foo_value');
					expect(this.element_list.at(1).get('value')).to.equal('new_related_bar_value');
					expect(this.element_list.at(2).get('value')).to.equal('unchanged value');
				});
				it('models should stop listening to the old related model', function() {
					this.element_list.setRelatedModel(this.new_related_model);
					this.related_model.set({
						'foo': 'updated_old_foo_value',
						'bar': 'updated_old_bar_value',
					});
					expect(this.element_list.at(0).get('value')).to.equal('new_related_foo_value');
					expect(this.element_list.at(1).get('value')).to.equal('new_related_bar_value');
					expect(this.element_list.at(2).get('value')).to.equal('unchanged value');
				});
			});

		});

		describe('setRelatedModel', function() {
			beforeEach(function() {
				this.element_list = new ElementList(elements.objects);
			});

			it('should exist', function() {
				expect(this.element_list.setRelatedModel).to.exist;
			});
			it('should be a function', function() {
				expect(_.isFunction(this.element_list.setRelatedModel)).to.be.true;
			});
			it('should set element_list.related_model to a model if given a model', function() {
				var model = new Model();
				this.element_list.setRelatedModel(model);
				expect(this.element_list.related_model).to.equal(model);
			});
			it('should set element_list.related_model to undefined if given undefined', function() {
				var model;
				this.element_list.setRelatedModel(model);
				expect(this.element_list.related_model).to.not.exist;
			});

		});


	});

});
