var helper = require('./test_helper')
  , Haiku = require('haiku')
  , path = require('path')
  , _ = require('underscore')
  , testCase = require('nodeunit').testCase
;

exports['new Haiku({ //... })'] = testCase({
  setUp: function(callback){
    this.haiku = new Haiku()

    callback();
  },
  tearDown: function(callback){
    callback();
  },
  initialization: function(test){
    var haiku = this.haiku
      , properties = ['content', 'collections', 'partials', 'layouts']
    ;

    test.equal(typeof haiku.content, 'object');
    test.equal(typeof haiku.collections, 'object');
    test.equal(typeof haiku.partials, 'object');
    test.equal(typeof haiku.layouts, 'object');

    test.done();
  },

  defaults: function(test){
    var haiku = this.haiku;

    test.equal(haiku.get('contentdir'), 'content');
    test.equal(haiku.get('templatesdir'), 'templates');
    test.equal(haiku.get('publicdir'), 'public');

    test.done();
  }
});

exports['Haiku #hasCollection(content)'] = testCase({
  setUp: function(callback){
    this.haiku = new Haiku()

    callback();
  },
  tearDown: function(callback){
    callback();
  },
  'when the collection exists': function(test){
    var haiku = this.haiku;

    haiku.collections = { posts: [] };

    test.ok(haiku.hasCollection('posts'));
    test.done();
  },
  'when the collection does NOT exist': function(test){
    test.equal(this.haiku.hasCollection('posts'), false);
    test.done();
  }
});

exports['Haiku #addContent(content)'] = function(test){
  test.done();
};

exports['Haiku #read()'] = testCase({
    setUp: function(callback){
      this.haiku = new Haiku({
        source: path.resolve(path.join('examples', 'basic'))
      });

      callback();
    }
  , tearDown: function(callback){ callback(); }

  , 'should be defined': function(test){
      test.notEqual(this.haiku.read, undefined);
      test.done();
    }
  , 'should emit a ready event': function(test){
      var haiku = this.haiku;

      test.expect(1);

      haiku.on('ready', function(){
        test.ok(true, 'the event was emitted');
        test.done();
      });

      haiku.read();
    }
  , 'should populate the haiku.partials object': function(test){
      var haiku = this.haiku;

      test.expect(3);

      haiku.on('ready', function(){
        test.ok(true, 'the event was emitted');
        test.notEqual(haiku.partials, undefined);
        test.equal(_.size(haiku.partials), 1);
        test.done();
      });

      haiku.read();
    }
  , 'should populate the haiku.layouts object': function(test){
      var haiku = this.haiku;

      test.expect(3);

      haiku.on('ready', function(){
        test.ok(true, 'the event was emitted');
        test.notEqual(haiku.partials, undefined);
        test.equal(_.size(haiku.partials), 1);
        test.done();
      });

      haiku.read();
    }
});

if (module == require.main) {
  require('nodeunit').reporters.default.run(['test']);
}
