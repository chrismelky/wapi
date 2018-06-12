'use strict';

let config = require('./config');

const Sequelize = require('sequelize');
const db = new Sequelize('postgres://postgres:p@ssw0rd@localhost:5432/wapi');
db.authenticate()
    .then(()=>{console.info("Connection with database succeeded.");})
    .catch(error =>{
      console.error("Fail to connect to database");
      console.error(error);
});
exports.db = db;


