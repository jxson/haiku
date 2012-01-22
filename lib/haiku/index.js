
var haiku = module.exports
  , path = require('path')
  , utile = require('utile')
  , optimist = require('optimist')
  , dir = path.normalize(path.join(__dirname, '..', '..'))
;

haiku.directories = { root: dir
  , commands: path.join(dir, 'bin', 'commands')
};

haiku.cli = require('./cli');
