/*
$.setPrefixedClassname
DOM helper for setting the a mutually-exclusive prefixed classname on a node
e.g. $('.profile.type-foo').setPrefixedClassname('type', 'bar') will become .profile.type-bar
*/
(function($){
	'use strict';
	$.fn.setPrefixedClassname = function(prefix, suffix) {
		var regex = new RegExp(prefix+'-.+'),
			classname = prefix+'-'+suffix;

		return this.each(function() {
			var $this = $(this);
			if ($this.hasClass(classname)) return; // don't apply if already applied

			var classes = $this.attr('class') || '';
			classes = $.map(classes.split(' '), function(c) {
				if (c && ! regex.test(c)) return c;
			});
			classes.push(classname);

			$this.attr('class', classes.join(' '));
		});
	};
})(jQuery);
