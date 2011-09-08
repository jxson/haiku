var helper = require('../test_helper')
  , Haiku = require('haiku')
  , Content = require('haiku/content')
  , path = require('path')
  , _ = require('underscore')
  , testCase = require('nodeunit').testCase
;

exports['Content #read()'] = function(test){
  var source = path.resolve(path.join('examples', 'basic'))
    , indexpath = path.resolve(path.join(source, 'content', 'index.mustache'))
    , haiku = new Haiku({ source: source })
    , content = new Content({ file: indexpath })
  ;

  test.expect(2);
  test.ok(content.read);

  content.on('ready', function(){
    test.ok(true);
    test.done();
  });

  content.read();
};

if (module == require.main) {
  var filename = __filename.replace(process.cwd(), '');

  require('nodeunit').reporters.default.run([filename]);
}
