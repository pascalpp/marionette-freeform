var fs     = require('fs');
var path   = require('path');
var unwrap = require('../unwrap');
var assert = require('assert');

describe('unwrapping UMD modules', function() {
  it('should work', function(done) {
    unwrap(path.resolve(__dirname, 'fixtures/sample.js'), function(e, output) {
      assert.equal(fs.readFileSync(path.resolve(__dirname, 'fixtures/expected_output.js'), "utf8"), output)
      done();
    });
  });
})
