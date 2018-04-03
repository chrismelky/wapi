'use strict';

const GeoJSON = require('mongoose-geojson-schema');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Location = require('./location').Location;

/**
 * @module  Product
 * @description contain the details of Attribute
 */

let ProductSchema = new Schema({

    name : { type: String},
    description:{type:String},
    userId : { type: Schema.Types.ObjectId,ref:'User'},
    placeId : { type: Schema.Types.ObjectId,ref:'Place'},
    productCategoryId:{type:Schema.Types.ObjectId, ref:'ProductCategory'},
    productBrandId :{type:Schema.Types.ObjectId, ref:'ProductBrand'},
    images:[
        {
            uri:{type:String,required:true},
            isDefault:{type:Boolean,default:false}
        }
    ],
    soh:{type:Number,min:0,default:0},
    locationType:{type:{enum:['user','place','static']}}
});

let product = Location.discriminator('product', ProductSchema);

/** export schema */
module.exports = {
    Product : product
};
