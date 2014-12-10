define(function(require) {
	'use strict';

	var InputView = require('./input_view');


	var InputRadioView = InputView.extend({

		attribute_keys: ['type', 'id', 'name', 'disabled', 'checked', 'value'],

		constructor: function() {
			InputView.apply(this, arguments);

			// listen for external changes to the model
			this.listenTo(this.model, 'change:checked', this.onModelChangeChecked);

			// delegated listener for clicks on any radio button with the same name
			$('body').on('click.'+this.cid,
				'input[type=radio][name='+this.model.get('name')+']',
				_.bind(this.onInputRadioClick, this));

			// remove delegated listener when this view is destroyed
			this.on('destroy', function() {
				$('body').off('click.'+this.cid);
			});
		},

		onInputRadioClick: function(e) {
			if (e.target !== this.el) {
				// some other radio button with the same name was clicked
				// this doesn't trigger a change event on this.$el
				// so we have to unset checked in the model here
				this.model.set('checked', false);
			}
		},

		onInputChange: function() {
			var checked = this.$el.is(':checked');
			this.model.set('checked', checked);
		},

		getInputValue: function() {
			var checked = this.$el.is(':checked');
			var value = this.model.get('value');
			if (checked) return value;
		},

		setInputValue: function(value) {
			this.$el.attr('value', value);
		},

		onModelChangeChecked: function(model, checked, options) {
			this.$el.prop('checked', checked);
		}
	});

	return InputRadioView;

});
