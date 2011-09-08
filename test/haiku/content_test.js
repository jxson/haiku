var helper = require('../test_helper')
  , Haiku = require('haiku')
  , Content = require('haiku/content')
  , path = require('path')
  , _ = require('underscore')
  , testCase = require('nodeunit').testCase
;

exports['Content #read()'] = function(test){
  var source = path.resolve(path.join('examples', 'basic'))
    , indexpath = path.join(source, 'content', 'index.mustache')
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

exports['Content #extractAttributesFromFile(callback)'] = testCase({
  setUp: function(callback){
    var source = path.resolve(path.join('examples', 'basic'))
      , indexpath = path.join(source, 'content', 'index.mustache')
      , haiku = new Haiku({ source: source })
    ;

    this.content = new Content({ file: indexpath }, haiku);

    callback();
  },
  tearDown: function(callback){
    callback();
  },
  'on successful file read': {
    'when there is front matter': function(test){
      var index = this.content;

      test.equal(index.get('title'), undefined);

      test.expect(3);

      index.extractAttributesFromFile(function(){
        test.ok(true, 'index.extractAttributesFromFile callback triggered');
        test.equal(index.get('title'), 'This is the homepage');
        test.done();
      });
    }
  }
});

if (module == require.main) {
  var filename = __filename.replace(process.cwd(), '');

  require('nodeunit').reporters.default.run([filename]);
}
