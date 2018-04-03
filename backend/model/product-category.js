'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @model  ProductCategory
 * this model for product categories
 */
/**Defining Mongoose Product Category Schema with attribute **/
var options = {collection:'product_categories'};
var ProductCategorySchema = new Schema({
    name : { type: String,unique: true},
    description:{type:String},
    parentId :{type:Schema.Types.ObjectId,ref:'ProductCategory'},
},options);

/**Create Product Category Model from Product Category Schema*/
var productCategory = mongoose.model('productCategory', ProductCategorySchema);

/** Export product category model */
module.exports = {
    ProductCategory : productCategory,
};
