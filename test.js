var path = require('path');
require.paths.unshift(path.join(__dirname, '.'));

require("./lib/haiku/server").run({
  address: "127.0.0.1", port: 1337,
  haiku: {
    logger: { 
      level: "debug" 
    }, 
    directories: { 
      content: "../rocket.ly/content", 
      templates: "../rocket.ly/templates",
      public: "../rocket.ly/public"
    },
    index: "index"
  }
});