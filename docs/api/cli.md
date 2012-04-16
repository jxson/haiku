## CLI

get this from the sinatra or sammy router

The CLI provides a simple way to define handlers for specific command routes.

cli.default = function(params){
  console.error('there is no ' + params.command)

  cli.dispatch('help')
}

cli.alias('-c', '--config', String)

cli.command('foo', function(){

})

cli.command('help', function(){

})

cli.command('foo *', function(){
  this.params.what === 'bar'
})

cli.start(function(){
  // empty command handler can go here
})

routes can be defined with regex or strings string routes can have params

    'foo :what'
    param.what

or

    'foo *'
    param.splat

    /foo (.*)$/
    params.capture

help is dispatched on --help, help

