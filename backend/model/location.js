'use strict';

const GeoJSON = require('mongoose-geojson-schema');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * @module  Location
 * @description contain the details of Attribute
 */
var options = { discriminatorKey: 'kind',collection:'locations'};
var LocationSchema = new Schema({
    location: {
        type: "Point",
        coordinates: []
    },
},options);

var location = mongoose.model('location', LocationSchema);

/** export schema */
module.exports ={Location:location} ;
