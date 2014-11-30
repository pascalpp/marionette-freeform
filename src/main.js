/* global hljs  */
define(function(require) {
	'use strict';

	var
	Example				= require('examples/basic'),
	ExampleText			= require('text!examples/basic.js'),
	log					= require('lib/log'); /* jshint ignore: line */

	var jshint = new RegExp('\\s+\/\\* jshint.*\\*\/', 'gim');
	var begin = new RegExp('[^•]+\/\\* begin example \\*\/', 'gim');
	var end = new RegExp('\\s+\/\\* end example \\*\/[^•]+', 'gim');
	ExampleText = ExampleText.replace(jshint, '');
	ExampleText = ExampleText.replace(begin, '');
	ExampleText = ExampleText.replace(end, '');
	$('pre code').text(ExampleText);
	$('pre code').each(function(i, block) {
		hljs.highlightBlock(block);
	});



});
