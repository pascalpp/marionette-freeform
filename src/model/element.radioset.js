define(function(require) {
	'use strict';

	var Marionette = require('marionette');
	var BaseElement = require('./element.base');


	var RadiosetElement = BaseElement.extend({

		validateConstructor: function(attrs) {
			if (! attrs.values) throw new Error('Radioset Element requires a list of values.');

			// ensure that `values` is a ElementList
			var ElementList = Marionette.FreeForm.ElementList;
			if (attrs.values instanceof ElementList) return attrs;

			// attempt to convert a Backbone.Collection or array to an ElementList
			if (attrs.values instanceof Backbone.Collection) {
				// convert Backbone.Collection to an array
				attrs.values = attrs.values.toJSON();
				// let next step convert it from an array to an ElementList
			}

			if (_.isArray(attrs.values)) {
				// have to set type to radio before converting to an ElementList
				// or Element creation will fail
				_.each(attrs.values, function(item) {
					item.type = 'radio';
				});
				attrs.values = new ElementList(attrs.values);
			}

			// if still not an ElementList, conversion failed, throw an error
			if (! (attrs.values instanceof ElementList)) {
				throw new Error('Select Element requires a list of values.');
			}

			return attrs;
		},

		initializeElement: function() {
			this.radios = this.get('values');

			this.setRadioNames();
			this.setCheckedRadio();

			this.listenTo(this.radios, 'change:checked', this.onRadioChangeChecked);
			this.listenTo(this, 'change:value', this.setCheckedRadio);
		},

		onRadioChangeChecked: function(model, checked, options) {
			if (checked) {
				this.set('value', model.get('value'));
			}
		},

		setRadioNames: function() {
			// set name of every radio element to this name
			this.radios.each(function(radio) {
				radio.set({
					name: this.get('name')
				});
			}, this);
		},

		setCheckedRadio: function() {
			var value = this.get('value'),
				checked = this.radios.findWhere({ checked: true });

			if (checked && checked.get('value') !== value) {
				checked.set('checked', false);
			}

			var same_value = this.radios.findWhere({ 'value': value });
			if (same_value) same_value.set('checked', true);
		}

	});

	return RadiosetElement;

});