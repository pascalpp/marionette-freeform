/* global describe, it, expect, beforeEach */
/* jshint expr: true */
define(function(require) {
	'use strict';

	require('src/lib/setPrefixedClassname');

	describe('$.setPrefixedClassname', function() {

		describe('adding a prefixed classname', function() {
			beforeEach(function() {
				this.div = $('<div />');
			});

			it('should add a new classname', function() {
				expect(this.div.hasClass('foo-bar')).to.be.false;
				this.div.setPrefixedClassname('foo', 'bar');
				expect(this.div.hasClass('foo-bar')).to.be.true;
			});

			it('should replace an existing classname with the same prefix', function() {
				this.div.addClass('foo-bar');
				expect(this.div.hasClass('foo-bar')).to.be.true;
				this.div.setPrefixedClassname('foo', 'bing');
				expect(this.div.hasClass('foo-bar')).to.be.false;
				expect(this.div.hasClass('foo-bing')).to.be.true;
			});

			it('should not remove an existing classname that doesn’t have the same prefix', function() {
				this.div.addClass('boo-bar');
				expect(this.div.hasClass('boo-bar')).to.be.true;
				this.div.setPrefixedClassname('foo', 'bar');
				expect(this.div.hasClass('boo-bar')).to.be.true;
				expect(this.div.hasClass('foo-bar')).to.be.true;
			});

			it('should not remove an existing classname that is the same as the prefix', function() {
				this.div.addClass('foo');
				expect(this.div.hasClass('foo')).to.be.true;
				this.div.setPrefixedClassname('foo', 'bar');
				expect(this.div.hasClass('foo')).to.be.true;
				expect(this.div.hasClass('foo-bar')).to.be.true;
			});

			it('should work with a numeric suffix', function() {
				expect(this.div.hasClass('foo-3')).to.be.false;
				this.div.setPrefixedClassname('foo', 3);
				expect(this.div.hasClass('foo-3')).to.be.true;
				this.div.setPrefixedClassname('foo', 4);
				expect(this.div.hasClass('foo-3')).to.be.false;
				expect(this.div.hasClass('foo-4')).to.be.true;
			});

		});


	});

});
