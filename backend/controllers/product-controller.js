'use strict';

const Joi = require('joi');
const Boom = require('boom');
const Product = require('../models/product').Product;
const productService = require('../services/product-service');
const Helper = require('../Helper');
const mongoose = require('mongoose');
const fs = require("fs");
const Path = require('path');
const uuidV1 = require('uuid/v1');

exports.save = {
    validate: {
        payload: {
            _id:Joi.string(),
            name  : Joi.string(),
            description  : Joi.string(),
            userId :Joi.string(),
            placeId :Joi.string(),
            productCategoryId:Joi.string(),
            productBrandId:Joi.string(),
            soh:Joi.number(),
            barCode:Joi.string(),
            price:Joi.object({amount:Joi.number(),currency:Joi.string()}),
            locationType:Joi.string().valid('USER','PLACE')
        }
    },
    auth:'jwt',
    handler: async function (request, h) {
        let productInfo = request.payload;
        productInfo.userId = (request.payload.userId !== undefined)?request.payload.userId:request.userId;
        try {
            return await productService.save(productInfo);
        }
        catch (error){
            console.log(error);
            return Boom.badRequest(error);
        }
    }
};

exports.uploadPicture = {
    payload: {
        maxBytes: 20971520000,
        output: 'stream'
    },
    auth:'jwt',
    handler: async function (request, h) {
        try {
            return await productService.uploadPicture(request.payload);
        }
        catch (error){
            return Boom.badRequest(error);
        }
    }
}
exports.removePicture ={
    validate: {
        payload: {
            _id  : Joi.string().required(),
            productId  : Joi.string().required()
        }
    },
    handler: async function (request, h) {
        let data = request.payload;
        return Product.findOne({_id:data.productId}).then(function (product) {
            if(product !== null){
                try {
                    product.images.id(data._id).remove();
                }catch (error){
                    return Boom.badRequest("Image does not exist");
                }
                return product.save().then(function (saved) {
                    console.log(saved);
                    return {"successMessage":"Picture removed"};
                }).catch(function (error) {
                    console.log(error);
                    return Boom.badRequest(error.message);
                })
            }
        });
    }
};
exports.setDefaultPicture ={
    validate: {
        payload: {
            _id  : Joi.string().required(),
            productId  : Joi.string().required()
        }
    },
    handler: async function (request, h) {
        let data = request.payload;

        return Product.update({"_id":data.productId,"images.isDefault":true},{$set:{"images.$.isDefault":false}},{ multi: true }).then(function (status) {
            console.log(status);
                return Product.update({"_id":data.productId,"images._id":data._id},{"images.$.isDefault":true}).then(function (status2) {
                    console.log(status2);
                    return status2;
                    if(status.nModified === 1){

                    }
                    else {
                        return Boom.badRequest("Cant Set picture default");
                    }
                }).catch(function (error) {
                    console.log(error);
                    return Boom.badRequest(error.message);
                });
        }).catch(function (error) {
            console.log(error);
            return Boom.badRequest(error.message);
        });
    }
};
exports.setDefaultPicture ={
    validate: {
        payload: {
            _id  : Joi.string().required(),
            productId  : Joi.string().required()
        }
    },
    handler: async function (request, h) {
        let data = request.payload;

        return Product.update({"_id":data.productId,"images.isDefault":true},{$set:{"images.$.isDefault":false}},{ multi: true }).then(function (status) {
            console.log(status);
                return Product.update({"_id":data.productId,"images._id":data._id},{"images.$.isDefault":true}).then(function (status2) {
                    console.log(status2);
                    return status2;
                    if(status.nModified === 1){

                    }
                    else {
                        return Boom.badRequest("Cant Set picture default");
                    }
                }).catch(function (error) {
                    console.log(error);
                    return Boom.badRequest(error.message);
                });
        }).catch(function (error) {
            console.log(error);
            return Boom.badRequest(error.message);
        });
    }
};
