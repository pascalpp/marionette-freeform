define(function(require) {

	var Form = require('src/model/form');
	var Element = require('src/model/element');
	var ElementList = require('src/model/element_list');
	var elements = require('spec/helpers/element_types');

	describe('Form', function() {
		'use strict';

		describe('with no elements', function() {
			beforeEach(function() {
				this.error = null;
				try {
					this.form = new Form();
				} catch(e) {
					this.error = e;
				}
			});

			it('should not exist', function() {
				expect(this.form).to.not.exist;
			});
			it('should throw an error', function() {
				expect(this.error).to.exist;
			});

		});

		describe('with elements as array', function() {
			beforeEach(function() {
				this.error = null;
				try {
					this.form = new Form({ elements: elements.objects });
				} catch(e) {
					this.error = e;
				}
			});

			it('should exist', function() {
				expect(this.form).to.exist;
			});
			it('should not throw an error', function() {
				expect(this.error).to.not.exist;
			});

			describe('with a related model', function() {
				beforeEach(function() {
					this.error = null;
					this.elements = [
						{ type: 'text', related_key: 'foo' },
						{ type: 'text', related_key: 'bar' },
						{ type: 'text', value: 'unchanged value' },
					];
					this.related_model = new Backbone.Model({
						foo: 'related_foo_value',
						bar: 'related_bar_value'
					});
					try {
						this.form = new Form({
							elements: this.elements,
							related_model: this.related_model
						});
					} catch(e) {
						this.error = e;
					}
				});

				it('should exist', function() {
					expect(this.form).to.exist;
				});
				it('should not throw an error', function() {
					expect(this.error).to.not.exist;
				});
				it('models should get values from related model', function() {
					var element_list = this.form.get('elements')
					expect(element_list.at(0).get('value')).to.equal('related_foo_value');
					expect(element_list.at(1).get('value')).to.equal('related_bar_value');
					expect(element_list.at(2).get('value')).to.equal('unchanged value');
				});
			});

		});

		describe('with elements as ElementsList', function() {
			beforeEach(function() {
				this.error = null;
				this.element_list = new ElementList(elements.objects);
				try {
					this.form = new Form({ elements: this.element_list });
				} catch(e) {
					this.error = e;
				}
			});

			it('should exist', function() {
				expect(this.form).to.exist;
			});
			it('should not throw an error', function() {
				expect(this.error).to.not.exist;
			});

			describe('with a related model', function() {
				beforeEach(function() {
					this.error = null;
					this.element_list = new ElementList([
						{ type: 'text', related_key: 'foo' },
						{ type: 'text', related_key: 'bar' },
						{ type: 'text', value: 'unchanged value' },
					]);
					this.related_model = new Backbone.Model({
						foo: 'related_foo_value',
						bar: 'related_bar_value'
					});
					try {
						this.form = new Form({
							elements: this.element_list,
							related_model: this.related_model
						});
					} catch(e) {
						this.error = e;
					}
				});

				it('should exist', function() {
					expect(this.form).to.exist;
				});
				it('should not throw an error', function() {
					expect(this.error).to.not.exist;
				});
				it('models should get values from related model', function() {
					var element_list = this.form.get('elements')
					expect(element_list.at(0).get('value')).to.equal('related_foo_value');
					expect(element_list.at(1).get('value')).to.equal('related_bar_value');
					expect(element_list.at(2).get('value')).to.equal('unchanged value');
				});
			});

		});


	});

});
