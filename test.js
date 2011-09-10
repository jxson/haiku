var path = require('path');
require.paths.unshift(path.join(__dirname, '.'));

require("./lib/haiku").Server.run({
  address: "127.0.0.1", port: 1337,
  logger: { 
    level: "info" 
  }, 
  haiku: {
    directories: { 
      content: "../rocket.ly/content", 
      templates: "../rocket.ly/templates",
      public: "../rocket.ly/public"
    },
    index: "index"
  }
});