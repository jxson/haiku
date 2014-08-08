
const EE = require('events').EventEmitter
const inherits = require('inherits')

module.exports = Haiku

function Haiku(options) {
  if (!(this instanceof Haiku)) return new Haiku(options)

  options = options || {}
}

inherits(Haiku, EE)
