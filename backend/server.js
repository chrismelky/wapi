'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Inert = require('inert');
const Db = require('./config/db');
const config = require('./config/config');
const routes = require('./route').routes;
const validator = require('./authentication').validator;

/** Define server at pot 4000 with CORS enabled for all routes**/
const server = new Hapi.Server({
    port: 4000,
  	routes: {
      cors: {origin:['*']},
      files: {
        relativeTo: Path.join(__dirname, './')
      }
  },
});

/**
 * register plugins
 */
const registerPlugins = async() => {
    await server.register([
        {plugin:Inert},
        {plugin:require('hapi-auth-jwt2')}
    ]);
}
/**
 * Configure server to authenticate using jwt
 */
const configAuthentication = async() => {
    await server.auth.strategy('jwt', 'jwt', {
        key: config.jwt.privateKey,
        validate: validator,
        verifyOptions: { algorithms: [ 'HS256' ] }
    });
}
const init = async () => {
    try {
        await registerPlugins();

        await configAuthentication();
        /**
         * Set jwt as default authentication method
         */
        server.auth.default('jwt');
        /**
         * Register routes
         */
        server.route(routes);

        await server.start();
        console.log('Server running at:', server.info.uri);
    }
    catch (error){
        console.log(error);
        process.exit(1);
    }
};

process.on('uncaughtException',
    e => require('opn')(`http://stackoverflow.com/search?q=[node.js ]+${e.message}`)
);

init();
