var H = require("./lib/haiku");
var h = new H({ logger: { level: "debug" }, directories: { content: "../rocket.ly/content", templates: "../rocket.ly/templates" }});
h.on("ready",function() { console.log("READY"); console.log(h); });
h.on("error",function(err) { console.log(err.message); console.log(err.stack); })
h.read();