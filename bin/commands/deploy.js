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
  , _ = require('underscore')
;

plugin.name = 'deploy command';

plugin.attach = function(){
  var app = this
    , commander = app.commander
  ;

  commander
    .command('deploy')
    .description('deploy the site to [target] if defined')
    .option('-c, --config [file]', 'Your haiku configuration file, defaults to .haiku (relative to the source dir)', String)
    .option('-s, --source [dir]', 'Path to your haiku\'s root, defaults to the cwd', String)
    .option('--strategy <ftp|s3>', 'The deployment strategy to use (s3|ftp)', String)
    .option('--s3-bucket <bucket name>', 'S3 bucket', String)
    .option('--aws-key <key>', 'AWS key', String)
    .option('--aws-secret <sectret>', 'AWS secret', String)
    .action(function(cmd){
      // console.log('action with options', cmd);

      // TODO: rename `root` to `source`
      var options = { config: cmd.config
          , root: cmd.source
          , strategy: cmd.strategy
          , s3Bucket: cmd.s3Bucket
          , awsKey: cmd.awsKey
          , awsSecret: cmd.awsSecret
          }
      ;

      console.log('deploy options', options);

      haiku.site(options).deploy();
    });
};
