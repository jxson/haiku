//
// var deploy = module.exports = function(commander){
//   commander
//     .command('deploy [env]')
//     .description('run setup commands for all envs')
//     .option("-s, --setup_mode [mode]", "Which setup mode to use")
//     .action(function(env, options){
//       var mode = options.setup_mode || "normal";
//       env = env || 'all';
//       console.log('setup for %s env(s) with %s mode', env, mode);
//     });
// };


// var deploy = module.exports = { command: 'deploy [target]'
//     , description: 'run setup commands for all envs'
//     , options: []
//     , action: function(){
//       // body...
//     }
// };

var plugin = module.exports
  , haiku = require('../../lib/haiku/index.js')
  , utile = require('utile')
  , _ = require('underscore')
;

plugin.name = 'deploy command';

plugin.attach = function(){
  var app = this
    , commander = app.commander
  ;

  commander
    .description('deploy the site to [target] if defined')
    .option('-c, --config [file]', 'Your haiku configuration file, defaults to .haiku (relative to the source dir)', String)
    .option('-s, --source [dir]', 'Path to your haiku\'s root, defaults to the cwd', String)
    .option('--stratagy <ftp|s3>', 'The deployment strategy to use (s3|ftp)', String)
    .option('--s3-bucket <bucket name>', 'S3 bucket', String)
    .option('--aws-key <key>', 'AWS key', String)
    .option('--aws-secret <sectret>', 'AWS secret', String)
    .action(function(cmd){
      // console.log('action with options', cmd);

      // TODO: rename `root` to `source`
      var options = { config: cmd.config
          , root: cmd.source
          , stratagy: cmd.stratagy
          , s3Bucket: cmd.s3Bucket
          , awsKey: cmd.awsKey
          , awsSecret: cmd.awsSecret
          }
      ;

      console.log('deploy options', options);
      
      app.site.
      
      // var site = new haiku.Site(options);
      //
      // site.on('ready', function(){
      //   console.log('site is ready');
      //   site.deploy();
      // }).read();
    });
};
