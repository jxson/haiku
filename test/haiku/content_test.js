var helper = require('../test_helper')
  , Haiku = require('haiku')
  , path = require('path')
  , _ = require('underscore')
  , testCase = require('nodeunit').testCase
;

exports.woot = function(test){
  test.ok(true)
  test.done()
}

if (module == require.main) {
  var filename = __filename.replace(process.cwd(), '');

  require('nodeunit').reporters.default.run([filename]);
}
