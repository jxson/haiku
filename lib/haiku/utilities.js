var _= require("underscore");

exports.getNameFromPath = function(path) {
  var components = _(path.split("/")).last().split(".").slice(0,2);
  if (components[1]=="html") {
    return components.join(".");
  } else { return components[0]; }
};

