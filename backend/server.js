const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const Routes = require('./routes');
const Db = require('./config/db');

const server = new Hapi.Server({
    port: 3000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, '../webapp/public')
        }
    }
});

const provision = async () => {

    await server.register(Inert);

    server.route(Routes.endPoints);

    await server.start();

    console.log('Server running at:', server.info.uri);
};

provision();