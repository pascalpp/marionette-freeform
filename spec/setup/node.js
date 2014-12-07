var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiJq = require('chai-jq');
var requireHelper = require('./require_helper');

chai.use(sinonChai);
chai.use(chaiJq);

global.expect = chai.expect;
global.sinon = sinon;

if (!global.document || !global.window) {
  var jsdom = require('jsdom').jsdom;

  global.document = jsdom('<html><head><script></script></head><body></body></html>', null, {
    FetchExternalResources   : ['script'],
    ProcessExternalResources : ['script'],
    MutationEvents           : '2.0',
    QuerySelector            : false
  });

  global.window = document.createWindow();
  global.navigator = global.window.navigator;

  global.window.Node.prototype.contains = function (node) {
    return this.compareDocumentPosition(node) & 16;
  };
}

global._ = require('underscore');
global.Backbone = require('backbone');
global.Backbone.$ = require('jquery-deferred');
global.Marionette = require('backbone.marionette');
global.Marionette.Deferred = global.Backbone.$.Deferred;
global.define = function(callback) {
	return callback(require);
};

console.log(requireHelper('model/element'));
