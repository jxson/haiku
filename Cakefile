sys = require 'sys'
{spawn, exec} = require 'child_process'

task 'docs', 'generate the inline documentation', ->
  command = [
    'rm -r docs'
    'node_modules/docco/bin/docco lib/*.js lib/haiku/*.js'
  ].join(' && ')

  exec(command, (err) -> throw err if err)

option '-s', '--spec', 'fgnvadtb'
task 'test', 'run all the tests', (options)->
  spec = if options.spec then '--spec' else '--dot-matrix'

  command = [
    'node_modules/vows/bin/vows'
    spec
    'test/*.js'
    'test/*/*.js'
  ].join(' ')

  sys.puts command

  child = exec(command, (err) -> throw err if err)
  child.stdout.on 'data', (data) -> sys.print data
