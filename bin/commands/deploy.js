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
;

plugin.name = 'deploy command';

plugin.attach = function(){
  var app = this
    , commander = app.commander
  ;

  commander
    .command('deploy [target]')
    .description('deploy the site to the desired [target]')
    .action(function(){
      console.log('deploy action');
    });

    // '   --source,--root PATH  # Path to your haiku\'s root, defaults to the cwd',
    // '   --config,-c PATH      # Path to your haiku config file, defaults to the cwd/config/haiku.js',
    // '   --key KEY             # Your s3 api key',
    // '   --secret SECRET       # Your s3 secret',
    // '   --bucket BUCKET       # The bucket to beam your site to',
    //
};
