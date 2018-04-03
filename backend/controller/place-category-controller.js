'use strict';

const Joi = require('joi');
const Boom = require('boom');
const PlaceCategory = require('../model/place-category').PlaceCategory;
const mongoose = require('mongoose');

exports.create = {
    validate: {
        payload: {
            name  : Joi.string().required(),
            parentId :Joi.string()
        }
    },
    handler: async function (request, h) {
       try {

           let category = new PlaceCategory(request.payload);
           return category.save().then(function (newCategory) {
               return {"successfulMessage": "Category Created"};
           }).catch(function (error) {
                   console.log(error);
                   return Boom.badRequest(error.message);
           });
       }catch (error){
           console.log(error);
           return Boom.badRequest("error.message");
       }
    }
};
exports.get = {
    handler: async function (request, h) {
        try {
            if (request.auth.isAuthenticated) {
                return await  PlaceCategory.find({}).then(function (categories) {
                    if(categories !== null && categories.length >0) {
                        return categories;
                    }else {
                        return [];
                    }
                });
            }
            else {
                return Boom.badRequest('NOT_AUTHORIZED');
            }
        }
        catch (error){
            console.log(error);
            return Boom.badRequest(error.message);
        }
    }
}


