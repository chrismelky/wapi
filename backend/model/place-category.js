'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @model  ProductCategory
 * this model for product categories
 */
/**Defining Mongoose Product Category Schema with attribute **/
var options = {collection:'place_categories'};
var PlaceCategorySchema = new Schema({
    name : { type: String,unique: true},
    parentId :{type:Schema.Types.ObjectId,ref:'PlaceCategory'},
    description:{type:String},
},options);

/**Create Product Category Model from Product Category Schema*/
var placeCategory = mongoose.model('placeCategory', PlaceCategorySchema);

/** Export product category model */
module.exports = {
    PlaceCategory : placeCategory,
};
