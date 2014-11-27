/*
$.setPrefixedClassname
DOM helper for setting the a mutually-exclusive prefixed classname on a node
e.g. $('.profile.type-foo').setPrefixedClassname('type', 'bar') will become .profile.type-bar
*/
(function($){
	'use strict';
	$.fn.setPrefixedClassname = function(prefix, suffix) {
		return this.each(function() {
			var $this = $(this),
				classname = prefix+'-'+suffix;
			if ($this.hasClass(classname)) return; // don't apply if already applied

			var classes = $this.attr('class') && $this.attr('class').split(' ') || [],
				regex = new RegExp(prefix+'-.+');

			classes = _.filter(classes, function(c) {
				return (! c.match(regex));
			});
			classes.push(classname);

			node.attr('class', classes.join(' '));
		});
	};
})(jQuery);
