
var haiku = module.exports
  , path = require('path')
  , utile = require('utile')
  , broadway = require('broadway')
  , dir = path.normalize(path.join(__dirname, '..', '..'))
;

haiku.app = new broadway.App();

haiku.app.directories = { root: dir
  , plugins: path.join(dir, 'lib', 'haiku', 'plugins')
  , commands: path.join(dir, 'bin', 'commands')
};

haiku.plugins = utile.requireDirLazy(haiku.app.directories.plugins);
