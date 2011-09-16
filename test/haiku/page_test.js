var helper = require('../test_helper')
  , vows = require('vows')
  , assert = require('assert')
;

vows.describe('Page').addBatch({
  '.processors': {
    '.textile': 'pending',
    '.mustache': 'pending',
    '.markdown': 'pending'
  },
  '._createResource': 'pending',
  'new Page(options)': 'pending',
  '#read(callback)': 'pending',
  '#render(attributes)': 'pending',
  '#renderWithoutLayout(attributes)': 'pending',
  '#toJSON()': 'pending'
}).export(module);
