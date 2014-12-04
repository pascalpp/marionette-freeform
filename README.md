marionette-freeform
==========
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/pascalpp/marionette-freeform?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Draft specification by [@pascalpp](http://github.com/pascalpp), November 2014.


**marionette-freeform** (working title) is a library of Model and View entities based on [Marionette](http://marionettejs.com) and [Backbone](http://backbonejs.org), designed to facilitate building HTML forms, along with validation, error messaging, and submission.

I've already started building some of the entities described here. This is a work in progress and is not yet feature-complete. You can play with some working examples on the [demo page](http://pascalpp.github.io/marionette-freeform/).

#### Requirements:

- [Backbone](http://backbonejs.org)
- [Marionette](http://marionettejs.com)
- [Underscore](http://underscorejs.org)



# Models

## Element

The building block of Free Forms is the `Element`. It is a model with these attributes:

- `type`: corresponds to the HTML input type used to display the element. Example types are `text`, `password`, `textarea`, `checkbox`, `radio`, `select`, `submit`, `reset`, `button`.
- `value`: A text string, a number, or a boolean. 
- `label`: A string which is shown in a label next to the element's input.
- `placeholder`: For text-based elements, a string which is displayed inside the input when empty.
- `name`: (optional) The name attribute for the input.
- `id`: (optional) The id attribute for the input.
- `related_model`: (optional) An external model that can be used for input validation, and whcih will ultimately receive its value from the element when the user submits the form.
- `key`: (optional) The name which corresponds to the related attribute in the related model.
- `validator`: (optional) A method that can be used to validate the input of the element when the user makes changes. Can provide additional validation on top of the related model's validation, such as asynchronous server-side validation.
- `error`: (read-only) A string error message that is set automatically whenever validation fails on the element.

Some Elements, such as `radio` and `select`, should also have a `values` attribute, which is a collection of models, each with a `value` and a `label`.

Elements also have these display options as attributes:

- `el`: A CSS selector matching the DOM node for this element. (A DOM selector in a model is weird, I know. Still mulling this. See ElementView below for more.)
- `show_label`: Boolean. Shows or hides the label.
- `show_label_before`: Show the label before the input. e.g. above a text field.
- `show_label_after`: Show the label after the input. e.g. to the right of a checkbox
- `label_class`: String classname. Default is 'label', i.e. label.label to distinguish from error labels.
- `error_class`: String classname. Default is 'error', i.e. label.error to distinguish from regular labels. When an error occurs, this class is also applied to the parent element. This allows for different styling on the input itself or its parent.

Note that these options don't imbue any appearance. That is up to your CSS.


## ElementList

An `ElementList` is simply a collection of `Elements`.


## Form

A `Form` is a model. It defines the overall properties and behavior of an HTML form. It has these attributes:

- `elements`: an ElementList containing all the elements in the form.
- `related_model`: (optional) An external model that can be used for input validation, and which will ultimately be updated with data from the form upon submission.
- `validator`: (optional) A global validator for the whole form. Can be used to validate interdependencies between different elements, such as matching password fields. Can also be used for asynchronous server-side validation.
- `error`: (read-only) A string error message that is set automatically whenever validation fails on the form itself or one of its elements. Will be set to the error message provided by the first invalid element in the `elements` collection, or the error message returned by the form's own `validator` if it exists.

## Model Relationships

A visual hierarchy of these entities:

`Form > ElementList > Element (> Values)`



# Views

## InputView

An `InputView` is a `Marionette.ItemView` that simply displays the appropriate HTML form element for a given element's `type`. That mapping is:

- `text` : `<input type="text">`
- `password` : `<input type="password">`
- `textarea` : `<textarea></textarea>`
- `checkbox` : `<input type="checkbox">`
- `radio` : `<input type="radio">`
- `select` : `<select></select>`
- etc.

An InputView is not meant to be used directly. It is consumed by an `ElementView`, as described below.

## ElementView

An `ElementView` is a `Marionette.ItemView` which displays an `InputView` for the input element corresponding to its model's `type`, surrounding the input with any specifed labels or error messaging. The ElementView wraps all these nodes in a parent tag, which by default is a `fieldset`.

## FormView

A `FormView` is a `Marionette.LayoutView` which receives a `Form` model. The FormView displays an `ElementView` for each element in the form's `elements` collection. The `template` provided to the FormView should define a DOM element for each element, matching the element's `el` selector. This allows you to define the order of elements separately from their order in the collection, and to provide any custom markup or grouping you require.

### An example FormView template, for a Sign Up page:

	<form>
		<fieldset class="first-name"></fieldset>
		<fieldset class="last-name"></fieldset>
		<fieldset class="user-name"></fieldset>
		<fieldset class="password1"></fieldset>
		<fieldset class="password2"></fieldset>
		<button></button>
	</form>
Note that the markup is pretty straightforward, and leaves appearance to your CSS.


#### A note about .el and element consumption

At the moment I'm leaning toward not using Marionette Regions in any of these views, and instead assigning an `el` attribute to each Element, which its ElementView will find in the parent FormView and consume as its own. There are a couple reasons for this thinking:
	
- Re-rendering HTML form elements generally leads to a bad user experience (losing focus state, cursor position, selection, etc.). So I'm biasing this framework toward rendering elements once and then managing any DOM changes dynamically and automatically. Which means we don't need the dynamic view-swapping that regions provide.
- HTML forms already require a lot of markup. A goal of of Free Forms is to minimize the markup required, so leaving out regions means one less DOM node per element.
- Since FormView is a LayoutView, developers could still use regions for other purposes.
- Considering make .el consumption the default behavior, but allowing devs to use regions if they prefer.

# Validation

Unless you're using some additional validation framework, Backbone validation is pretty simple and effective for most scenarios. How it works in a nutshell, without Free Forms:

- You check if `model.isValid()`.
- Then `isValid` calls the model's `validate` method, passing the model's current attributes.
- The `validate` method is empty by default; you must define its behavior. For example:

		validate: function(attrs) {
			if (! attrs.user_name) {
				return 'User requires a username.';
			}
			if (whitespace_regex.test(attrs.password)) {
				return 'Your password cannot contain spaces.'
			}
			if (bob_regex.test(attrs.first_name)) {
				return 'Your first name cannot be Bob.'
			}
			if (attrs.last_name.length > 30) {
				return 'Your last name is kinda long.'
			}
		}

- If `validate` returns a string, that string is set as `model.validationError` and `isValid` returns `false`. Then your code can show that error message somewhere.

However, one of the key requirements of Free Forms is being able to validate individual attributes. Backbone.Model.isValid checks _all_ attributes, and it doesn't tell us directly which attribute generated the error. When a user modifies an input element, we need to be able to validate just one attribute and display only errors that apply to it. To address this need, I'm using a subclass of Backbone.Model called BaseModel, which modifies validation thusly:

- First, it overrides the `validate` method to loop through the keys of the passed attributes, calling a new method `validateAttribute` for each one, passing the key and its value.

		validate: function(attrs) {
			var invalid;
			_.each(_.keys(attrs), function(key) {
				if (invalid) return; // only return first error
				invalid = this.validateAttribute(key, attrs[key]);
			}, this);
			return invalid;
		},

- Then it defines the new `validateAttribute` method, which looks for a `validator` function in `this.validators`:

		validateAttribute: function(key, val) {
			var validator = this.validators && this.validators[key];
			if (_.isFunction(validator)) {
				return validator.call(this, val);
			}
		},

- this.validators is undefined in the BaseModel, but can be defined in any subclass. Here are the same example validators from above:
	
		validators: {
			'user_name': function(user_name) {
				if (! user_name) return 'A username is required.';
			},
			'password': function(password) {
				if (whitespace_regex.test(password)) return 'Your password cannot contain spaces.';
			},
			'first_name': function(first_name) {
				if (bob_regex.test(first_name)) return 'Your first name cannot be Bob.';
			},
			'last_name': function(last_name) {
				if (last_name.length > 30) return 'Your last name is kinda long.';
			}
		},
		
The net effect of these modifications is that `Model.isValid` works just as before, but instead of definiing logic in `Model.validate`, we add a validator method for each attribute in `Model.validators`. Having done so, we can call `Model.isValid()` to validate the whole model in its current state, but we can _also_ call `Model.validateAttribute(attr, value)` to find out if that value _would be_ valid for that attribute, before we even set it on the model. It is this hook that is key to how Free Forms validation works.

When the user makes a change in an HTML input, the InputView gets the value and sets it on the Element model. That triggers a change event listener in the ElementView, which calls its own validate method. If the element has a related model, it calls `related_model.validateAttribute(this.model.key, this.model.value)` (pseudo-code). If that method returns an error string, that error is set on the Element model, which triggers the view to show a label.error near the input field. Any subsequent input changes will rerun validation, and if the validation doesn't return an error, the error attribute is unset on the Element model and the error label automatically disappears.

Since this validation technique requires some modifications to Backbone's default validation methods, I'm not sure how best to incorporate this into Free Forms. But without it, the elegance of Free Forms's error-handling solution isn't really possible.

**Possible solutions:**

- Provide a FreeForm.Model which provides these new validation methods. Developers would have to use this model as the parent class for their models. Not so great.
- Provide a FreeForm.applyModelValidation method which developers could call, passing in their preferred BaseModel. This method could apply to Backbone.Model by default
- need to think about this some more.

### TODO

See [TODO.md](TODO.md)
