'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    Product = require('../model/product').Product,
    Helper = require('../Helper'),
    mongoose = require('mongoose');
const fs = require("fs");
const Path = require('path');
const uuidV1 = require('uuid/v1');

exports.create = {
    validate: {
        payload: {
            name  : Joi.string().required(),
            description  : Joi.string(),
            productCategoryId:Joi.string(),
            productBrandId:Joi.string(),
            soh:Joi.number(),
            locationType:Joi.string().valid('user','place','static'),
            latitude  : Joi.number(),
            longitude  : Joi.number(),
            placeId :Joi.string()
        }
    },
    handler: async function (request, h) {
        if(request.auth.isAuthenticated) {
            let userId = request.auth.artifacts.userId;
            let data = request.payload;
            try {
                return Product.findOne({userId:userId,name:data.name,productCategoryId:data.productCategoryId}).then(function (existing) {
                    if(existing === null){
                        if(data.locationType === 'static' && data.latitude !==undefined && data.longitude !== undefined ){
                            data.location={type:"Point",coordinates:[request.payload.longitude,request.payload.latitude]};
                        }
                        let product = new Product(data);
                        product.userId = userId;
                        console.log(product);
                        return  product.save().then(function (newProduct) {
                            console.log(newProduct);
                            return  newProduct;
                        }).catch(function (error) {
                            return Boom.badRequest(error.message);
                        });
                    }else {
                        return Boom.badRequest("Product exists");
                    }
                });

            }
            catch (error){
                console.log(error);
                return Boom.badRequest(error.message);
            }
        }
        else{
            return Boom.badRequest('NOT_AUTHENTICATED');
        }
    }
};
exports.update = {
    validate: {
        payload: {
            _id  : Joi.string().required(),
            name  : Joi.string(),
            description  : Joi.string(),
            productCategoryId:Joi.string(),
            productBrandId:Joi.string(),
            soh:Joi.number(),
            locationType:Joi.string().valid('user','place','static'),
            latitude  : Joi.number(),
            longitude  : Joi.number(),
            placeId :Joi.string()
        }
    },
    handler: async function (request, h) {
        console.log(request.payload);
        if(request.auth.isAuthenticated) {
            let data = request.payload;
            try {
                if(data.locationType === 'static' && data.latitude !==undefined && data.longitude !== undefined ){
                    data.location={type:"Point",coordinates:[request.payload.longitude,request.payload.latitude]};
                }
                return Product.update({_id:data._id},data).then(function (status) {
                    if(status.n === 1 && status.ok ===1){
                        return {"successMessage":"Product Modified"};
                    }else  {
                        return Boom.badRequest("Product doesn't exists");
                    }
                });
            }
            catch (error){
                console.log(error);
                return Boom.badRequest(error.message);
            }
        }
        else{
            return Boom.badRequest('NOT_AUTHENTICATED');
        }
    }
};
exports.uploadPicture = {
    payload: {
        maxBytes: 20971520000,
        output: 'stream'
    },
    handler: async function (request, h) {
        if(request.payload.product_pic === undefined){
            return Boom.badRequest('Picture is required');
        }
        if(request.payload._id === undefined){
            return Boom.badRequest('Product _id is required');
        }
        if(request.auth.isAuthenticated) {
            let userId = request.auth.artifacts.userId;
            let data = request.payload;
            return Product.findOne({userId:userId,_id:data._id}).then(function(existing){
                if(existing !== null || existing !== undefined){
                    let imageId =uuidV1();
                    let imageUrl ='/uploads/users/'+userId+'/products/'+imageId+'.png';
                    let imageUri = Path.join(__dirname, '..'+imageUrl);
                    let file =request.payload["product_pic"];
                    return new Promise(function (resolve,reject) {
                        file.on('error', function (err) {
                            reject(Boom.badRequest('ERROR_UPLOADING_IMAGE')) ;
                        });
                        try {
                            file.pipe(fs.createWriteStream(imageUri));
                        }catch (e){
                            reject({"errorMessage":"Error uploading product picture"}) ;
                        }
                        file.on('end', function (err) {
                            if(err){
                                console.log(error);
                                return Boom.badRequest(error);
                            }
                            if(existing.images.length < 5) {
                                let isDefault =(existing.images.length === 0);
                                existing.images.addToSet({uri: imageUrl, isDefault: isDefault});
                                return existing.save().then(function () {
                                    console.log(existing);
                                    resolve({'successMessage': 'IMAGE_UPLOADED_SUCCESSFUL'});
                                }).catch(function (error) {
                                    console.log(error);
                                     reject(Boom.badRequest(error.message));
                                });
                            }else {
                                reject(Boom.badRequest("Maximum number of 5 images reached"));
                            }
                        });
                    });
                }
                else{
                    return Boom.badRequest('PRODUCT_DOES_NOT_EXIST');
                }
            });
        }
        else{
            return Boom.badRequest('NOT_AUTHENTICATED');
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
