var helper = require('./test_helper')
  , Haiku = require('haiku')
  , path = require('path')
  , _ = require('underscore')
  , testCase = require('nodeunit').testCase
;

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
