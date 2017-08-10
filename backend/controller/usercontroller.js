'use strict';
// Boom: HTTP friendly error handler
// Joi: Schema validation

var Joi = require('joi'),
  Boom = require('boom');
  // User = require('../model/user').User,
  // mongoose = require('mongoose');


exports.getAll = {
  handler: function (request, reply) {
    const query = 'SELECT * FROM users';
    request.pg.client.query(query, function(err, result) {
      if (!err) {
        return reply(result.rows);
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });
  }
};

exports.getOne = {
  handler: function (request, reply) {
    const query = {
        name: 'getUser',
        text: 'SELECT * FROM users WHERE id = $1',
        values: [request.params.userId]
    }
    request.pg.client.query(query, function(err, result) {
      if (!err) {
        return reply(result.rows[0]);
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });
  }
};

exports.create = {
  validate: {
    payload: {
      user_name   : Joi.string().required(),
      password  : Joi.string().required(),
      first_name  : Joi.string().required(),
      last_name  : Joi.string().required(),
    }
  },
  handler: function (request, reply) {
    const user = request.payload;
    const query = {
        text: 'INSERT INTO users(user_name,password, first_name,last_name) VALUES($1, $2, $3, $4)',
        values: [user.user_name,user.password,user.first_name,user.last_name],
    }
    request.pg.client.query(query, function(err, result) {
      if (!err) {
        return reply(result); // HTTP 201
      }
      if (11000 === err.code || 11001 === err.code) {
        return reply(Boom.forbidden("please provide another user id, it already exist"));
      }
      return reply(Boom.forbidden(err)); // HTTP 403
    });

  }
};

exports.update = {
  validate: {
    payload: {
      username  : Joi.string().required()
    }
  },
  handler: function (request, reply) {
    User.findOne({ 'userId': request.params.userId }, function (err, user) {
      if (!err) {
        user.username = request.payload.username;
        user.save(function (err, user) {
          if (!err) {
            return reply(user); // HTTP 201
          }
          if (11000 === err.code || 11001 === err.code) {
            return reply(Boom.forbidden("please provide another user id, it already exist"));
          }
          return reply(Boom.forbidden(err)); // HTTP 403
        });
      }
      else{
        return reply(Boom.badImplementation(err)); // 500 error
      }
    });
  }
};

exports.remove = {
  handler: function (request, reply) {
    User.findOne({ 'userId': request.params.userId }, function (err, user) {
      if (!err && user) {
        user.remove();
        return reply({ message: "User deleted successfully"});
      }
      if (!err) {
        return reply(Boom.notFound());
      }
      return reply(Boom.badRequest("Could not delete user"));
    });
  }
};

exports.removeAll = {
  handler: function (request, reply) {
    mongoose.connection.db.dropCollection('users', function (err, result) {
      if (!err) {
        return reply({ message: "User database successfully deleted"});
      }
      return reply(Boom.badRequest("Could not delete user"));
    });
  }
};
