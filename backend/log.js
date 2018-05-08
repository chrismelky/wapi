_log = global.console.log
global.console.log = function(){
    var args = arguments
    args[0] = '\033[31m' +args[0] + '\x1b[0m'
    return _log.apply(null, args)
}

global.error = global.console.error = msg =>
    console.log( '\x1b[31m\x1b[1mError:\x1b[22m \x1b[93m' + msg + '\x1b[0m' )
global.info = global.console.info = msg =>
    console.log( '\x1b[31m\x1b[36mInfo:\x1b[22m \x1b[93m\x1b[0m' + msg )
global.log = console.log