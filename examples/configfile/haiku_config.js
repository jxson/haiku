
module.exports = {
  host: "127.0.0.1",
  port: 1337,
  root: __dirname,
  contentDir: "app/markdown",
  templatesDir: "assets/templates",
  publicDir: "public",
  baseURL: 'http://domain.tld/',
  attributes: {
    title: 'Awesome Site, Crazy Directory Structure'
  }
};


// var Logger = require("haiku/logger")
//   , root = "./examples/basic/";
//
// module.exports = {
//   server: {
//     address: "127.0.0.1", port: 1337
//   },
//   logger: new Logger({level: "info" }),
//   site: {
//     directories: {
//       content: root + "content",
//       templates: root + "templates",
//       public: root + "public"
//     },
//     index: "index"
//   }
// };
