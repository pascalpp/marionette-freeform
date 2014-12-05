var Element = require('../src/model/element');

describe('Element', function() {
  'use strict';

  describe('when creating an element with no type', function() {
    beforeEach(function() {
      var error;
      this.fooOptions = { foo: 'bar' };
      this.element = new Element(this.fooOptions);
    });

    it('should throw an error', function() {
      expect(this.initializeStub).to.have.been.calledOn(this.app).and.calledWith(this.appOptions);
    });

  });

});
