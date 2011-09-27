sys = require 'sys'
{spawn, exec} = require 'child_process'

task 'docs', 'generate the inline documentation', ->
  command = [
    'rm -r docs'
    'node_modules/docco/bin/docco lib/*.js lib/haiku/*.js'
  ].join(' && ')

  exec(command, (err) -> throw err if err)

option '-s', '--spec', 'Use Vows spec mode'
task 'test', 'run all the tests', (options)->
  args = [
    'test/haiku_test.js'
    'test/haiku/cli_test.js'
    'test/haiku/collection_test.js'
    'test/haiku/page_test.js'
    'test/haiku/server_test.js'
    'test/haiku/site_test.js'
  ]
  args.unshift '--spec' if options.spec

  vows = spawn 'vows', args
  vows.stdout.on 'data', (data) -> sys.print data
  vows.stderr.on 'data', (data) -> sys.print data
