marionette-freeform TODO
==========

- [x] button elements (submit, reset, generic?)
- [x] setup test framework
- [ ] radio button elements
- [ ] convert error-region to a status-region
	- allows for 'valid' messaging
	- set status-valid or status-error on fieldset.element after input is validated
	- accept valid\_message as an element attribute, show valid\_message in status\_region
- [ ] select multiple elements
    - does it make sense to code for this? kinda complex since it shares a type with a very different entity
    - better to use a list of checkboxes in most cases
- [ ] validator options
    - e.g. options.strict
    - set to true when validating on submission, would allow validators to enforce required fields only on submission
- [ ] asynchronous validation
- [ ] autofocus attribute http://davidwalsh.name/autofocus
- [ ] input[type=hidden]
	- is there a need for this? 'hidden' values could just be defined in the form model and included in the serialized data
- [ ] input[type=file]
- [ ] input[type=image] ?
- [ ] _new_ input types? http://www.w3.org/TR/html-markup/input.html
- [ ] form data serialization
- [ ] form action attribute
	- should this library support traditional form submission?
	- or should it only support backbone.sync?
- [ ] form submission/backbone.sync
- [ ] build UMD deliverable
