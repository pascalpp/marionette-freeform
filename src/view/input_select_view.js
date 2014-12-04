define(function(require) {
	'use strict';

	/* parent input view, meant to be subclassed for specific input types */

	var InputSelectOptionView = Marionette.ItemView.extend({
		tagName: 'option',
		template: _.template('<%- label %>'),
		attributes: function() {
			return {
				value: this.model.get('value'),
				disabled: this.model.get('disabled'),
				selected: (this.model.get('value') === this.options.selected)
			};
		},

	});


	var InputSelectView = Marionette.CollectionView.extend({
		tagName: 'select',
		template: _.template(''),

		childView: InputSelectOptionView,
		childViewOptions: function() {
			return {
				selected: this.model.get('value')
			};
		},

		constructor: function(options) {
			Marionette.CollectionView.call(this, options);

			// convert model's `values` attribute to a collection
			this.collection = this.model.get('values');
			if (_.isArray(this.collection)) {
				this.collection = new Backbone.Collection(this.collection);
			}
			if (! (this.collection instanceof Backbone.Collection)) {
				throw new Error('InputSelectView requires an array or collection of values.');
			}

			// add placeholder option
			if (this.model.get('placeholder')) {
				this.collection.unshift({
					value: '',
					label: this.model.get('placeholder'),
					disabled: true
				});
			}

			// listen for external changes to the model
			this.listenTo(this.model, 'change:value', this.onModelChangeValue);

			// these steps allow the view to consume an existing dom element
			this.listenTo(this, 'render', this.setAttributes);
			var className = this.model.get('className');
			if (className) this.$el.addClass(className);
		},

		attributes: function() {
			return {
				id: this.model.get('id'),
				name: this.model.get('name'),
				size: this.model.get('size'),
			};
		},

		setAttributes: function() {
			var attributes = _.result(this, 'attributes');
			this.$el.attr(attributes);
		},

		triggers: {
			'change': 'input:change',
		},

		onInputChange: function() {
			var value = this.getInputValue();
			this.model.set('value', value, { from: this });
		},

		getInputValue: function() {
			return this.$el.val();
		},

		onModelChangeValue: function(model, value, options) {
			if (options.from !== this) {
				this.$el.val(value);
			}
		}
	});

	return InputSelectView;

});
