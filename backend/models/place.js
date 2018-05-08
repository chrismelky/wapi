'use strict';

const GeoJSON = require('mongoose-geojson-schema');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Location = require('./location').Location;

/**
 * @module  Product
 * @description contain the details of Attribute
 */

var PlaceSchema = new Schema({
    /**
     UserId. It can only contain string, is required and unique field which is indexed.
     */
    userId : { type: Schema.Types.ObjectId,ref:'User'},
    placeCategoryId:{type:Schema.Types.ObjectId, ref:'PlaceCategory'},
    name : { type: String,required: true,unique:true},
    description:{type:String},
    tags:[],
    images:[
        {
            _id:{type: String, unique: true, required: true},
            uri:{type:String,required:true},
            isDefault:{type:Boolean,default:false}
        }
    ],
});

var place = Location.discriminator('place', PlaceSchema);

/** export schema */
module.exports = {
    Place : place
};
