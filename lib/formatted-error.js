
const util = require('util')
const format = util.format
const inherits = util.inherits
const filter = require('filter-stack')

module.exports = HaikuError

function HaikuError(args) {
  // http://ejohn.org/blog/simple-class-instantiation/
  // http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
  http://npmawesome.com/posts/2014-08-11-verror/?utm_source=nodeweekly&utm_medium=email
  if (arguments.length > 1) {
    args = Array.prototype.slice.call(arguments)
  }

  if (! (this instanceof HaikuError)) {
    return new HaikuError(args)
  }

  var err = this

  Error.call(err)
  Error.captureStackTrace(err, HaikuError)

  err.name = err.constructor.name
  err.message = format.apply(null, args)

  err.stack = filter(err, [ 'haiku/lib/formatted-error' ]).stack

}

inherits(HaikuError, Error)
