marionette-freeform TODO
==========

- [x] button elements (submit, reset, generic?)
- [x] setup test framework
- [ ] radio button elements
- [ ] select multiple elements
    - does it make sense to code for this? kinda complex since it shares a type with a very different entity
    - better to use a list of checkboxes in most cases
- [ ] validator options
    - e.g. options.strict
    - set to true when validating on submission, would allow validators to enforce required fields only on submission
- [ ] asynchronous validation
- [ ] input[type=hidden]
	- is there a need for this? 'hidden' values could just be defined in the form model and included in the serialized data
- [ ] form data serialization
- [ ] form action attribute
	- should this library support tradition form submission?
	- or should it only support backbone.sync?
- [ ] form submission/backbone.sync
- [ ] build UMD deliverable
