
var haiku = module.exports
  , path = require('path')
  , utile = require('utile')
  , broadway = require('broadway')
  , dir = path.normalize(path.join(__dirname, '..', '..'))
;

haiku.App = broadway.App;

haiku.directories = { root: dir
  , plugins: path.join(dir, 'lib', 'haiku', 'plugins')
  , commands: path.join(dir, 'bin', 'commands')
};

haiku.plugins = utile.requireDirLazy(haiku.directories.plugins);
haiku.deploy = require('./deploy');
haiku.site = require('./site');