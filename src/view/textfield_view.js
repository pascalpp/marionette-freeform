define(function(require) {
	'use strict';

	/* MODULE DEPENDENCIES */
	var
	Marionette			= require('marionette'),
	Log					= require('log');

	Log.module('lib/form/textfield_view');
	var log = Log.create('form', 'textfield', '#eeeeee'); /* jshint ignore: line */

	/**
	@todo
	-
	*/

	// <input type="text" id="[[ data.id ]]" name="[[ data.name ]]" value="{{ data.value }}">
	var TextfieldView = Marionette.ItemView.extend({
		tagName: 'input',
		template: _.template(''),
		attributes: function() {
			return {
				id: this.model.cid,
				name: this.model.cid,
				size: this.model.get('size'),
				placeholder: this.model.get('placeholder'),
				maxlength: this.model.get('maxlength'),
				value: this.model.get('value')
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
			'keyup': 'onInput',
			'change': 'onInput'
		},
		onInput: function() {
			var value = this.$el.val();
			this.model.set('value', value, { from: this });
		},
		onChangeValue: function(model, value, options) {
			if (options.from !== this) {
				this.$el.val(value);
			}
		}
	});

	return TextfieldView;

});
