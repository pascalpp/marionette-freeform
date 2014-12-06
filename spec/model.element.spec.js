define(function(require) {

	var Element = require('src/model/element');

	describe('Element Model', function() {
		'use strict';

		describe('with no type', function() {
			beforeEach(function() {
				this.element_error = null;
				this.options = { foo: 'bar' };
				try {
					this.element = new Element(this.options);
				} catch(e) {
					this.element_error = e;
				}
			});

			it('should throw an error', function() {
				expect(this.element_error).to.exist;
				expect(this.element_error.message).to.equal('Element requires a type.');
			});

		});

		describe('with type text', function() {
			beforeEach(function() {
				this.options = { type: 'text' };
				this.element = new Element(this.options);
			});

			it('should have a default value of ""', function() {
				expect(this.element.get('value')).to.equal('');
			});
			it('should have show_label_before set to true', function() {
				expect(this.element.get('show_label_before')).to.be.true;
			});

		});

		describe('with type password', function() {
			beforeEach(function() {
				this.options = { type: 'password' };
				this.element = new Element(this.options);
			});

			it('should have a default value of ""', function() {
				expect(this.element.get('value')).to.equal('');
			});
			it('should have show_label_before set to true', function() {
				expect(this.element.get('show_label_before')).to.be.true;
			});

		});

		describe('with type textarea', function() {
			beforeEach(function() {
				this.options = { type: 'textarea' };
				this.element = new Element(this.options);
			});

			it('should have a default value of ""', function() {
				expect(this.element.get('value')).to.equal('');
			});
			it('should have show_label_before set to true', function() {
				expect(this.element.get('show_label_before')).to.be.true;
			});

		});

		describe('with type select', function() {
			beforeEach(function() {
				this.options = { type: 'select' };
				this.element = new Element(this.options);
			});

			it('should have a default value of ""', function() {
				expect(this.element.get('value')).to.equal('');
			});
			it('should have show_label_before set to true', function() {
				expect(this.element.get('show_label_before')).to.be.true;
			});

		});

		describe('with type buttonfield', function() {
			describe('with no input', function() {
				beforeEach(function() {
					this.error = null;
					this.options = {
						type: 'buttonfield',
						button: {
							type: 'submit',
						}
					};
					try {
						this.element = new Element(this.options);
					} catch(e) {
						this.error = e;
					}
				});

				it('should throw an error', function() {
					expect(this.error).to.exist;
					expect(this.error.message).to.equal('Element requires a type.');
				});
			});
			describe('with no button', function() {
				beforeEach(function() {
					this.error = null;
					this.options = {
						type: 'buttonfield',
						input: {
							type: 'text',
						}
					};
					try {
						this.element = new Element(this.options);
					} catch(e) {
						this.error = e;
					}
				});

				it('should throw an error', function() {
					expect(this.error).to.exist;
					expect(this.error.message).to.equal('Element requires a type.');
				});
			});
			describe('with input and button', function() {
				beforeEach(function() {
					this.error = null;
					this.options = {
						type: 'buttonfield',
						input: {
							type: 'text',
						},
						button: {
							type: 'submit',
						}
					};
					try {
						this.element = new Element(this.options);
					} catch(e) {
						this.error = e;
					}
				});

				it('should not throw an error', function() {
					expect(this.error).to.not.exist;
				});
				it('should have a default value of ""', function() {
					expect(this.element.get('value')).to.equal('');
				});
				it('should have show_label_before set to true', function() {
					expect(this.element.get('show_label_before')).to.be.true;
				});
			});

		});

		describe('with type submit, reset, or button', function() {
			beforeEach(function() {
				this.submit_element = new Element({ type: 'submit' });
				this.reset_element = new Element({ type: 'reset' });
				this.button_element = new Element({ type: 'button' });
			});

			it('should have a default label matching its type', function() {
				expect(this.submit_element.get('label')).to.equal('Submit');
				expect(this.reset_element.get('label')).to.equal('Reset');
				expect(this.button_element.get('label')).to.not.exist;
			});
			it('should have show_label_before set to false', function() {
				expect(this.submit_element.get('show_label_before')).to.be.false;
				expect(this.reset_element.get('show_label_before')).to.be.false;
				expect(this.button_element.get('show_label_before')).to.be.false;
			});
			it('should have show_label_after set to false', function() {
				expect(this.submit_element.get('show_label_after')).to.be.false;
				expect(this.reset_element.get('show_label_after')).to.be.false;
				expect(this.button_element.get('show_label_after')).to.be.false;
			});

		});

	});

});
