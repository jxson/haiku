
const levelup = require('levelup')
const hooks = require('level-hooks')
const memdown = require('memdown')
const xtend = require('xtend')
const debug = require('debug')
const encode = require('bytewise/hex').encode
const decode = require('bytewise/hex').decode

module.exports = Store

function Store() {
  if (!(this instanceof Store)) return new Store()

  var store = this

  store.debug = debug('haiku:store')
  store.db = levelup(memdown, { encoding: 'json' })

  hooks(store.db)
  store.db.hooks.pre(/^\//, before)
}

Store.prototype.get = function(key, callback) {
  var store = this
  var debug = store.debug
  var db = store.db

  debug('get %s', key)

  // It's possible to get a notFound error by looking up indexed pages by
  // name, or slug

  if (! key.match(/^\//)) {
    debug('not a url')
    store.search(key, callback)
  } else {
    db.get(key, callback)
  }
}

Store.prototype.search = function(key, callback) {
  var store = this
  var debug = store.debug
  var db = store.db
  var done = false

  debug('searching for: %s', key)

  db
  .createReadStream({
    keys: true,
    values: true,
    gt: encode([ undefined ])
  })
  .on('data', function(data) {
    var array = decode(data.key)
    var match = array.indexOf(key) >= 0

    if (match) {
      debug('match found for: %s', key)
      done = true
      store.get(data.value, callback)
    }
  })
  .on('end', function() {
    if (! done) callback()
  })
}

Store.prototype.put = function(page, callback) {
  var store = this
  var debug = store.debug
  var db = store.db
  var key = page.url

  debug('put: %s', key)

  db.put(key, page, onput)

  function onput(err) {
    if (err) callback(err)
    else store.get(key, callback)
  }
}

Store.prototype.patch = function(page, callback) {
  var store = this
  var debug = store.debug

  debug('patch %s', page.url, page)

  store.get(page.url, onget)

  function onget(err, original) {
    if (err && !err.notFound) return callback(err)

    page = xtend(original || {}, page)
    store.put(page, callback)
  }
}

// See level-hooks
function before(change, add) {
  var page = change.value
  var key = encode([
      undefined,
      page.url,
      page.name,
      page.slug
    ])

  add({ key: key, value: change.key, type: 'put' })
}
