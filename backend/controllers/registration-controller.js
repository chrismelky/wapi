'use strict';
const registrationService = require('../services/registration-service');
const Joi = require('joi');
const Boom = require('boom');

exports.register = {
    validate: {
        payload: {
            phoneNumber  : Joi.string().required()
        }
    },
    auth:false,
    handler: async (request, h) => {
        try {
            return await registrationService.register(request.payload);
        }
        catch (error){
            console.error(error);
            return Boom.badRequest(error.message);
        }
    }
};
exports.resendVerificationCode ={
    validate: {
        payload: {
            phoneNumber  : Joi.string().required()
        }
    },
    auth:false,
    handler: async (request, h) => {
        try {
            return await registrationService.resendVerificationCode(request.payload);
        }
        catch (error){
            console.error(error);
            return Boom.badRequest(error);
        }
    }

};
exports.verifyUser = {
    validate: {
        payload: {
            phoneNumber  : Joi.string().required(),
            requestVerificationCode  : Joi.number().required()
        }
    },
    auth:false,
    handler: async (request, h) => {
        try {
            return await registrationService.verify(request.payload);
        }
        catch (error){
            console.error(error);
            return Boom.badRequest(error);
        }
    }
};