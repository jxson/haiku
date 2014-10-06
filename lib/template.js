
const path = require('path')
const hogan = require('hogan.js')

module.exports = Template

function Template(options) {
  if (!(this instanceof Template)) return new Template(options)

  if (typeof options === 'string') {
    options = { basedir: options }
  }

  var template = this

  template.basedir = path.resolve(options.basedir)
  template.collection = {}
}

// this should be async so partials can be crawled and compiled
Template.prototype.compile = function(key, content) {
  var template = this

  template.collection[key] = hogan.compile(content)

  // scan for partials
}

Template.prototype.render = function(key, context) {
  var template = this

  return template.collection[key].render(context)
}
