'use strict';

const GeoJSON = require('mongoose-geojson-schema');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Location = require('./location').Location;

/**
 * @module  Product
 * @description contain the details of Attribute
 */
/**
 * Custom validator to validate if locationType is PLACE, placeId must be present
 * @type {{validator: conditionalPlaceIdValidator.validator, msg: string}}
 */

let ProductSchema = new Schema({
    name : { type: String, required:true},
    description:{type:String},
    userId : { type: Schema.Types.ObjectId,ref:'User'},
    placeId : { type: Schema.Types.ObjectId,ref:'Place',required:function () {
        return this.locationType === 'PLACE';
    }},
    productCategoryId:{type:Schema.Types.ObjectId, ref:'ProductCategory'},
    productBrandId :{type:Schema.Types.ObjectId, ref:'ProductBrand'},
    images:[
        {
            uri:{type:String,required:true},
            isDefault:{type:Boolean,default:false}
        }
    ],
    soh:{type:Number,min:0,default:0},
    barCode:{type:String},
    price:{
        amount:{type: Number,min:0.00,default:0.00},
        currency:{type:String}
    },
    transactions : [
        {
            quantity :{type:Number,min:0},
            price : {type:Number,min:0.00,default:0.00},
            transactionType : {type:String,enum:['CREDIT','DEBIT']},
            transactionDate:{type: Date, default: Date.now},
            reason:{type:String, enum:['ADJUSTMENT','SALE','BUY']}
        }
    ],
    locationType:{type:{enum:['USER','PLACE']}},

});

let product = Location.discriminator('product', ProductSchema);
/** export schema */
module.exports = {
    Product : product
};
