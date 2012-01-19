
var deploy = module.exports
  , utile = require('utile')
  , haiku = require('../index.js')
  , path = require('path')
  , recipes = utile.requireDirLazy(path.join(haiku.directories.root
    , 'lib'
    , 'haiku'
    , 'deploy'
    , 'strategies'
    ))
;

deploy.strategies = recipes;

deploy.run = function(options){
  console.log('deploy.run options', options);
};
