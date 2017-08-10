'use strict';

const Hapi = require('hapi');
const Routes = require('./routes');
const Path = require('path');
const Inert = require('inert');
const Config = require('./config/config');
require('env2')('.env');

var app = {};
app.config = Config;
console.log(process.env.DATABASE_URL);

const server = new Hapi.Server({
  connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '../frontend/src')
            }
        }
    }
});

server.connection({port:app.config.server.port, host:app.config.server.host});
server.register([
             Inert,
             require('hapi-postgres-connection')
  ], (err) => {
  });

server.route(Routes.endPoints);

server.start((err)=>{
   if(err){
     throw err;
   }
   console.log('server started at : '+ server.info.uri);
 });
