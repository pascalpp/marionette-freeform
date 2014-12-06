define(function(require) {
	'use strict';

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
				this.options = {
					related_model: new Backbone.Model({
						foo: 'related_foo_value',
						bar: 'related_bar_value'
					})
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

		});


	});

});