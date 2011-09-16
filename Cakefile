{spawn, exec} = require 'child_process'

task 'docs', 'generate the inline documentation', ->
  command = [
    'rm -r docs'
    'docco lib/*.js lib/haiku/*.js'
  ].join(' && ')

  exec(command, (err) -> throw err if err)
