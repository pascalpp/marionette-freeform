define(function(require) {
	'use strict';

	/* MODULE DEPENDENCIES */
	var
	Marionette			= require('marionette'),
	Log					= require('log');

	Log.module('lib/form/checkbox_view');
	var log = Log.create('form', 'checkbox', '#eeeeee'); /* jshint ignore: line */

	/**
	@todo
	-
	*/

	// <input type="checkbox" id="[[ data.id ]]" name="[[ data.name ]]" [[ data.checked ? 'checked' : '' ]]>
	var CheckboxView = Marionette.ItemView.extend({
		tagName: 'input',
		template: _.template(''),
		attributes: function() {
			return {
				id: this.model.cid,
				name: this.model.cid,
				checked: !! this.model.get('value')
			};
		},
		initialize: function() {
			this.listenTo(this.model, 'change:value', this.onChangeValue);
			this.listenTo(this, 'render', this.setAttributes);
			var className = this.model.get('className');
			if (className) this.$el.addClass(className);
		},
		setAttributes: function() {
			var attributes = _.result(this, 'attributes');
			this.$el.attr(attributes);
		},
		events: {
			'change': 'onInput'
		},
		onInput: function() {
			var value = this.$el.is(':checked');
			this.model.set('value', value, { from: this });
		},
		onChangeValue: function(model, value, options) {
			if (options.from !== this) {
				value = !! value;
				this.$el.attr('checked', value);
			}
		}
	});

	return CheckboxView;

});
