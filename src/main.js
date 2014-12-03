/* global hljs  */
define(function(require) {
	'use strict';

	var
	BasicExample			= require('examples/basic'),
	BasicCode				= require('text!examples/basic.js'),
	RelatedExample			= require('examples/related_model'),
	RelatedCode				= require('text!examples/related_model.js'),
	log						= require('lib/log'); /* jshint ignore: line */
	require('lib/setPrefixedClassname');

	var jshint = new RegExp('\\s+\/\\* jshint.*\\*\/', 'gim');
	var begin = new RegExp('[^•]+\/\\* begin example \\*\/', 'gim');
	var end = new RegExp('\\s+\/\\* end example \\*\/[^•]+', 'gim');

	var example_region = new Marionette.Region({
		el: '.example-region'
	});

	var examples = {
		'basic': {
			label: 'Basic form',
			description: 'A basic form with three elements. Each element provides its own validator. Try entering "Bob" as your first name to see an example.',
			view: BasicExample,
			code: BasicCode
		},
		'related_model': {
			label: 'Form with a related model',
			description: 'In this example, each element uses a <code>related_key</code> and the whole form uses a <code>related_model</code>. All validators are defined in the related model, with errors surfacing next to the appropriate form element. Try entering a long first name, or try entering a username that breaks one of the rules shown in the example code below.',
			view: RelatedExample,
			code: RelatedCode
		},
	};

	var showExample = function(example_name) {
		var example = examples[example_name];
		var viewer = new ExampleViewer({
			example: example
		});
		example_region.show(viewer);
	};

	var example_chooser = $('.chooser select.examples');

	_.each(_.keys(examples), function(key) {
		var option = $('<option />');
		option.val(key);
		option.text(examples[key].label);
		example_chooser.append(option);
	});
	example_chooser.on('change', function() {
		showExample(this.value);
	});


	var ExampleViewer = Marionette.LayoutView.extend({
		template: 'script.example',
		onRender: function() {
			this.showDescription();
			this.showFormView();
			this.showExampleCode();
		},
		showDescription: function() {
			this.$('.title').text(this.options.example.label);
			this.$('article').html(this.options.example.description);
		},
		showFormView: function() {
			var view = this.options.example.view;
			view.setElement(this.$('form'));
			view.render();
		},
		showExampleCode: function() {
			var code = this.options.example.code;
			code = code.replace(jshint, '');
			code = code.replace(begin, '');
			code = code.replace(end, '');
			code += '\n\n\tmy_region.show(form_view);\n\n';

			this.$('pre code').text(code);
			this.$('pre code').each(function(i, block) {
				hljs.highlightBlock(block);
			});
		}
	});

	showExample('basic');


});
