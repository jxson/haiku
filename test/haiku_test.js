var helper = require('./test_helper')
  , vows = require('vows')
  , assert = require('assert')
  , haiku = require('haiku')
;

vows.describe('haiku').addBatch({
  'exports': {
    topic: haiku,
    'should include the `Site` constructor': function(haiku){
      assert.isFunction(haiku.Site);
    },
    'should include the `Server` constructor': function(haiku){
      assert.isFunction(haiku.Server);
    }
  }
<<<<<<< HEAD
}).export(module);
=======
});

exports['Haiku #build()'] = function(test){
  var haiku = new Haiku({
    source: path.resolve(path.join('examples', 'basic'))
  });

  test.ok(haiku.build)
  test.done();
};

exports['Haiku configfile'] = function(test){
  var configfile = path.resolve(path.join('examples',
        'configfile',
        'haiku_config.js'))
    , haiku = new Haiku({ configfile: configfile })
    , config = require(configfile)
  ;

  test.equal(haiku.get('source'), config.source);
  test.done();
};

if (module == require.main) {
  var filename = __filename.replace(process.cwd(), '');

  require('nodeunit').reporters.default.run([filename]);
}
>>>>>>> master
