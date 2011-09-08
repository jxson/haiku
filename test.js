var H = require("./lib/haiku");
var h = new H({ logger: { level: "debug" }, directories: { content: "../rocket.ly/content", templates: "../rocket.ly/templates" }});
h.on("ready",function() { 
  console.timeEnd("haiku"); 
  console.log(h.resolve("blog/posts/native-apps-are-dead")); 
});
h.on("error",function(err) { console.log(err.message); console.log(err.stack); })
console.time("haiku");
h.read();