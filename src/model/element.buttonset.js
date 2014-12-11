define(function(require) {
	'use strict';

	var Marionette = require('marionette');
 	var BaseElement = require('./element.base');


	var ButtonsetElement = BaseElement.extend({

		validateConstructor: function(attrs) {
			if (! attrs.buttons) throw new Error('Buttonset Element requires a list of buttons.');

			// ensure that `buttons` is an ElementList
			var ElementList = Marionette.FreeForm.ElementList;
			if (_.isArray(attrs.buttons)) {
				attrs.buttons = new ElementList(attrs.buttons);
			}
			if (! (attrs.buttons instanceof ElementList)) {
				throw new Error('Buttonset Element requires a list of buttons.');
			}
			return attrs;
		}

	});

	return ButtonsetElement;

});