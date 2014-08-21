
const levelup = require('levelup')
const memdown = require('memdown')
const xtend = require('xtend')
const debug = require('debug')

module.exports = Store

function Store() {
  if (!(this instanceof Store)) return new Store()

  var store = this

  store.db = levelup(memdown, { valueEncoding: 'json' })

  store.debug = debug('haiku:store')
}

Store.prototype.get = function(name, callback) {
  var store = this
  var debug = store.debug
  var db = store.db

  debug('get %s', name)

  db.get(name, function(err, value) {
    if (err) return callback(err)
    else callback(err, value)
  })
}

Store.prototype.put = function(name, page, callback) {
  var store = this
  var debug = store.debug
  var db = store.db

  debug('put: %s', name)

  db.put(name, page, onput)

  function onput(err) {
    if (err) callback(err)
    else store.get(name, callback)
  }
}

Store.prototype.patch = function(name, value, callback) {
  var store = this
  var debug = store.debug

  debug('patch %s', name)

  store.get(name, onget)

  function onget(err, original) {
    if (err && !err.notFound) return callback(err)

    value = xtend(original || {}, value)

    store.put(name, value, callback)
  }
}
