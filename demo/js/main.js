/* global hljs  */
define(function(require) {
	'use strict';

	var
	Form					= require('src/model/form'),
	FormView				= require('src/view/form_view'),
	BasicExample			= require('./examples/basic'),
	BasicCode				= require('text!./examples/basic.js'),
	BasicTemplate			= require('text!./examples/template/basic.html'),
	RelatedExample			= require('./examples/related_model'),
	RelatedCode				= require('text!./examples/related_model.js'),
	RelatedTemplate			= require('text!./examples/template/related_model.html'),
	ButtonFieldExample		= require('./examples/button_field'),
	ButtonFieldCode			= require('text!./examples/button_field.js'),
	ButtonFieldTemplate		= require('text!./examples/template/button_field.html'),
	log						= require('src/lib/log'); /* jshint ignore: line */
	require('src/lib/setPrefixedClassname');

	var jshint = new RegExp('\\s+\/\\* jshint.*\\*\/', 'gim');
	var begin = new RegExp('[^•]+\/\\* begin example \\*\/\n', 'gim');
	var end = new RegExp('\\s+\/\\* end example \\*\/[^•]+', 'gim');

	var view_model = new Backbone.Model({
		example: 'basic',
		theme: 'inline'
	});

	var examples = {
		'basic': {
			label: 'Basic form',
			description: 'A basic form with a few elements. Each element provides its own validator. The first error returned by the validator is shown. Try entering "Bob" or "David" as your first name to see an example.',
			view: BasicExample,
			code: BasicCode,
			template: BasicTemplate
		},
		'related_model': {
			label: 'Form with a related model',
			description: 'Here, all validation is defined in a separate <code>User</code> model, which is used as the <code>related_model</code> for the form. Each element uses a <code>related_key</code> to associate it with a specific attribute of the user. The element gets its initial value from that user attribute and displays any errors associated with that attribute. Try entering a long first name, or try entering a username that breaks one of the rules shown in the example code below.',
			view: RelatedExample,
			code: RelatedCode,
			template: RelatedTemplate
		},
		'button_field': {
			label: 'Buttonfield',
			description: 'A very simple field consisting of a combined text field and button. This one requires a bit of CSS to achieve its appearance, of course.',
			view: ButtonFieldExample,
			code: ButtonFieldCode,
			template: ButtonFieldTemplate
		},
	};

	var ExampleViewer = Marionette.LayoutView.extend({
		template: 'script.example',
		ui: {
			form: 'form',
			title: '.title',
			description: 'article',
			code: 'pre.code code',
			template: 'pre.template code'
		},
		viewModelEvents: {
			'change:theme': 'setTheme'
		},
		initialize: function() {
			_.bindAll(this, 'focusFirstInput');
			this.bindEntityEvents(view_model, this.viewModelEvents);
		},
		onRender: function() {
			this.setTheme();
			this.showDescription();
			this.showFormView();
			this.showExampleCode();
			this.showExampleTemplate();
			this.highlightCode();
		},
		onShow: function() {
			_.defer(this.focusFirstInput);
		},
		setTheme: function() {
			var theme = view_model.get('theme');
			if (theme === 'unstyled') {
				this.ui.form.removeClass('freeform');
			} else {
				this.ui.form.addClass('freeform');
			}
			this.ui.form.setPrefixedClassname('freeform', theme);
		},
		showDescription: function() {
			this.ui.title.text(this.options.example.label);
			this.ui.description.html(this.options.example.description);
		},
		showFormView: function() {
			var view = this.options.example.view;
			view.setElement(this.ui.form);
			view.render();
		},
		showExampleCode: function() {
			var code = this.options.example.code;
			code = code.replace(jshint, '');
			code = code.replace(begin, '');
			code = code.replace(end, '');
			code += '\n\n';
			code += '\t// show the form in some region\n';
			code += '\tmy_region.show(form_view);\n';
			code = code.replace(/^\t/gim, '');

			this.ui.code.text(code);
		},
		showExampleTemplate: function() {
			var template = this.options.example.template;
			this.ui.template.text(template);
		},
		highlightCode: function() {
			this.$('pre code').each(function(i, block) {
				hljs.highlightBlock(block);
			});
		},
		focusFirstInput: function() {
			this.$('input, select, textarea').first().focus().select();
		}
	});

	var ChooserView = FormView.extend({
		className: 'chooser',
		template: 'script.chooser'
	});

	var MainView = Marionette.LayoutView.extend({
		el: 'div.main',
		template: 'script.main',
		regions: {
			chooser_region: '.chooser-region',
			example_region: '.example-region'
		},
		initialize: function() {
			this.listenTo(view_model, 'change:example', this.showCurrentExample);
		},
		onRender: function() {
			this.showChooser();
			this.showCurrentExample();
		},
		showChooser: function() {
			var chooser_form = new Form({
				elements: [
					{
						el: '.examples',
						type: 'select',
						label: 'Examples',
						placeholder: 'Choose one:',
						related_key: 'example',
						values: _.map(_.keys(examples), function(key) {
							return { value: key, label: examples[key].label };
						})
					},
					{
						el: '.themes',
						type: 'select',
						label: 'Theme',
						placeholder: 'Choose one:',
						related_key: 'theme',
						values: [
							{ value: 'inline', label: 'Inline' },
							{ value: 'stacked', label: 'Stacked' },
							{ value: 'mixed', label: 'Mixed' },
							{ value: 'unstyled', label: 'Unstyled' },
						]
					}
				],
				related_model: view_model
			});
			var chooser_view = new ChooserView({ model: chooser_form });
			this.chooser_region.show(chooser_view);
		},
		showCurrentExample: function() {
			var example_name = view_model.get('example');
			var example = examples[example_name];
			if (example) {
				this.viewer = new ExampleViewer({
					example: example
				});
				this.example_region.show(this.viewer);
			} else {
				this.example_region.empty();
				delete this.viewer;
			}
		}
	});

	var main_view = new MainView();
	main_view.render();

});
