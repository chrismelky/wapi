'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    User = require('../model/user').User,
    mongoose = require('mongoose');


exports.getAll = {
    handler: function (request, h) {
        return  User.find({});

    }
};

// exports.getOne = {
//     handler: function (request, reply) {
//         User.findOne({ 'userId': request.params.userId }, function (err, user) {
//             if (!err) {
//                 return reply(user);
//             }
//             return reply(Boom.badImplementation(err)); // 500 error
//         });
//     }
// };
//
exports.create = {
    validate: {
        payload: {
            userId   : Joi.string().required(),
            userName  : Joi.string().required()
        }
    },
    handler:  function (request, h) {
        var user = new User(request.payload);
        return user.save().then(function (user) {
            return user;
        });
    }
};
//
// exports.update = {h
//     validate: {
//         payload: {
//             username  : Joi.string().required()
//         }
//     },
//     handler: function (request, reply) {
//         User.findOne({ 'userId': request.params.userId }, function (err, user) {
//             if (!err) {
//                 user.username = request.payload.username;
//                 user.save(function (err, user) {
//                     if (!err) {
//                         return reply(user); // HTTP 201
//                     }
//                     if (11000 === err.code || 11001 === err.code) {
//                         return reply(Boom.forbidden("please provide another user id, it already exist"));
//                     }
//                     return reply(Boom.forbidden(err)); // HTTP 403
//                 });
//             }
//             else{
//                 return reply(Boom.badImplementation(err)); // 500 error
//             }
//         });
//     }
// };
//
// exports.remove = {
//     handler: function (request, reply) {
//         User.findOne({ 'userId': request.params.userId }, function (err, user) {
//             if (!err && user) {
//                 user.remove();
//                 return reply({ message: "User deleted successfully"});
//             }
//             if (!err) {
//                 return reply(Boom.notFound());
//             }
//             return reply(Boom.badRequest("Could not delete user"));
//         });
//     }
// };
//
// exports.removeAll = {
//     handler: function (request, reply) {
//         mongoose.connection.db.dropCollection('users', function (err, result) {
//             if (!err) {
//                 return reply({ message: "User database successfully deleted"});
//             }
//             return reply(Boom.badRequest("Could not delete user"));
//         });
//     }
// };