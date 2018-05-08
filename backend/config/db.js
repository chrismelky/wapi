'use strict';
let Mongoose = require('mongoose'),
    config = require('./config');

Mongoose.Promise = global.Promise;
// Mongoose.connect(config.database.url);
Mongoose.connect('mongodb://' + config.database.host + '/' + config.database.db,{ useMongoClient: true });
let db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.info("Connection with database succeeded.");
});

exports.Mongoose = Mongoose;
exports.db = db;
