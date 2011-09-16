var helper = require('../test_helper')
  , vows = require('vows')
  , assert = require('assert')
  , haiku = require('haiku')
;

vows.describe('haiku.Site').addBatch({
  'new haiku.Site(options)': {
    'with *default* options': 'pending',
    'with the `root` option': 'pending',
    'with the `destination` option': 'pending',
    'with the `directories.content` option': 'pending',
    'with the `directories.templates` option': 'pending',
    'with the `directories.public` option': 'pending'
  },
  '#read()': 'pending',
  '#find() / .resolve()': 'pending',
  '#toJSON()': 'pending',
  '#build()': 'pending'
}).export(module);
