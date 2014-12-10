/* global describe, it, expect, beforeEach, testregion */
/* jshint expr: true */
define(function(require) {
	'use strict';

	var InputViewTypes = require('src/view/input_view_types');
	var Element = require('src/model/element');
	var elements = require('spec/helpers/element_types');
	var clone = require('spec/helpers/clone');
	var log = require('src/lib/log'); /* jshint ignore: line */
	require('spec/helpers/jquery_attr');


	var type = 'radioset';

	describe('InputViewTypes', function() {

		describe('InputViewType radioset', function() {
			describe('view instance', function() {
				beforeEach(function() {
					// cloning because some tests modify these options
					// so each test needs its own copy of this.options
					this.options = clone(elements.index[type]);
					this.element = new Element(this.options);
					this.View = InputViewTypes[type];
					this.view = new this.View({ model: this.element });
				});

				it('should display the default model value if it exists in values', function() {
					var radios = this.element.get('values');
					var match = radios.findWhere({ value: this.element.get('value') });
					expect(match).to.exist;
					if (match) {
						testregion.show(this.view);
						expect(this.view.$('input[type=radio]:checked').length).to.equal(1);
						expect(this.view.$('input[type=radio]:checked').attr('value')).to.equal(this.element.get('value'));
						expect(this.view.$('input[type=radio]:checked').attr('value')).to.equal(match.get('value'));
					}
				});
				it('should display no value if no matches exist in values', function() {
					this.element.set('value', 'no match for this');
					var radios = this.element.get('values');
					var match = radios.findWhere({ value: this.element.get('value') });
					expect(match).to.not.exist;
					if (! match) {
						testregion.show(this.view);
						expect(this.view.$('input[type=radio]:checked').length).to.equal(0);
					}
				});
				it('should display a different initial model value', function() {
					var initial_value = 'foo';
					this.element.set('value', initial_value);
					testregion.show(this.view);
					expect(this.view.$('input[type=radio]:checked').attr('value')).to.equal(initial_value);
				});
				it('should set model value when input value changes', function() {
					testregion.show(this.view);
					var element = this.element;
					this.view.$('input[type=radio]').each(function() {
						this.click();
						expect(element.get('value')).to.equal(this.value);
					});
				});
				it('should update input value when model value changes', function() {
					testregion.show(this.view);
					var initial_value = this.element.get('value');
					var changed_value = 'foo';
					expect(initial_value).to.not.equal(changed_value); // test data validation
					var radios = this.element.get('values');
					var match = radios.findWhere({ value: changed_value });
					expect(match).to.exist; // test data validation
					this.element.set('value', changed_value);
					expect(this.view.$('input[type=radio]:checked').length).to.equal(1);
					expect(this.view.$('input[type=radio]:checked').attr('value')).to.equal(changed_value);
				});

				it('should add option nodes when values are added to values collection', function() {
					testregion.show(this.view);
					var values = this.element.get('values');
					var length = values.length;
					values.add({ type:'radio', value:'dark', 'label':'Dark' });
					expect(values.length).to.equal(length + 1);
					expect(this.view.$('input[type=radio]').length).to.equal(values.length);
				});
				it('should remove option nodes when values are removed from values collection', function() {
					testregion.show(this.view);
					var values = this.element.get('values');
					var length = values.length;
					values.remove(values.last());
					expect(values.length).to.equal(length - 1);
					expect(this.view.$('input[type=radio]').length).to.equal(values.length);
				});
			});

		});

	});

});
