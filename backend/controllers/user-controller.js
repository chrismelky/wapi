'use strict';

const Joi = require('joi');
const Boom = require('boom');
const Location = require('../models/location').Location;
const Product = require('../models/product').Product;
const Place = require('../models/place').Place;
const Helper = require('../Helper');
const mongoose = require('mongoose');
const fs = require("fs");
const Path = require('path');
const uuidV1 = require('uuid/v1');
const _ = require('lodash.pluck');

exports.getAll = {
	auth:'jwt',
    handler: async function (request, h) {
	    console.log(request.auth);
        return  Location.find();
    }
};

exports.updatePushNotificationId = {
    validate: {
        payload: {
            pushNotificationId  : Joi.string().required()
        }
    },
    handler: async function (request, h) {
        try {
            if(request.auth.isAuthenticated){
                return await User.update({_id:request.auth.artifacts.userId},
                                         {pushNotificationId:request.payload.pushNotificationId}).then(function (status) {
                    if(status.nModified === 1) {
                        return {"successMessage":"pushNotificationUpdated"};
                    }
                    else{
                        return Boom.badRequest("Error updating PNID");
                    }
                });
            }
            else{
                return Boom.badRequest("Not authorized");
            }
        }
        catch (error){
            console.log(error);
            return Boom.internal("Whoops something went wrong");
        }
    }
};
exports.updateUserLocation = {
    validate: {
        payload: {
            latitude  : Joi.number().required(),
            longitude  : Joi.number().required()
        }
    },
    handler: async function (request, h) {
        try {
            if(request.auth.isAuthenticated){
                    let userId =request.auth.artifacts.userId;
                    return await  User.findOne({_id:userId}).then(function (user) {
                      if(user !== null) {
                          console.log(user.mobileNumber);
                          try{
                              user.set({location:{type:"Point",coordinates:[request.payload.longitude,request.payload.latitude]}});
                              return user.save().then(function (user) {
                                  /**Update usr products location */
                                  return Product.update({userId:userId,locationType:'user'},
                                                 {$set:{location:{type:"Point",coordinates:[request.payload.longitude,request.payload.latitude]}}},
                                                 {multi:true}).then(function (status) {

                                      return Helper.getNearByPositions(request.payload.longitude,request.payload.latitude,user).then(function (nearBy) {
                                          /** Create JOb to notify friends near of a new comer */
                                          /**Create JOB to notify product/service own for a possible client **/
                                          return {"nearBy":nearBy};
                                      });

                                  }).catch(function (error) {
                                      console.log(error);
                                      Boom.badRequest("failed to save location");
                                  });
                              },function (error) {
                                  console.log(error);
                                  Boom.badRequest("failed to save location");
                              });
                          }
                          catch(error){
                              console.log(error);
                              Boom.badRequest("failed to get near location");
                          };
                      }
                      else{
                          Boom.badRequest("Invalid account");
                      }
                    });
            }
        }
        catch (error){
            return Boom.badRequest(error.message);
        }
    }
};
exports.updateProfileName = {
    validate: {
        payload: {
            profileName  : Joi.string().required()
        }
    },
    handler: async function (request, h) {
        try {
            if (request.auth.isAuthenticated) {
                return await  User.update({_id:request.auth.artifacts.userId},{profileName:request.payload.profileName}).then(function (status) {
                    if(status.nModified === 1) {
                        return {"successMessage":"Profile name updated"};
                    }
                    else{
                        return Boom.badRequest("Profile name not updated");
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
};
exports.uploadProfilePicture = {
    payload: {
        maxBytes: 20971520000,
        output: 'stream'
    },
    handler: async function (request, h) {
        try{
            if(request.auth.isAuthenticated) {
                let userId = request.auth.artifacts.userId;
                return User.findOne({_id:userId}).then(function(user){
                    if(user !== null && user !== undefined){
                        let imageId ="profile_pic";
                        let imageUrl ='/uploads/users/'+user._id +'/profile/'+ imageId+'.png';
                        let imageUri = Path.join(__dirname, '..'+imageUrl);
                        let file =request.payload["profile_pic"];
                        var saveFile = function () {
                            return new Promise(function (resolve,reject) {
                                file.on('error', function (err) {
                                    reject({"errorMessage":"Error uploading picture"}) ;
                                });
                                try {
                                    file.pipe(fs.createWriteStream(imageUri));
                                }catch (e){
                                    reject({"errorMessage":"Error uploading picture"}) ;
                                }
                                file.on('end', function (err) {
                                    resolve({'successMessage':'IMAGE_UPLOADED_SUCCESSFUL'}) ;
                                });
                            });
                        };
                        return saveFile().then(function (data) {
                            console.log("--------------");
                            console.log(data);
                            user.profileImageUrl = imageUrl;
                            return user.save().then(function () {
                                return data;
                            },function (error) {
                                console.log(error);
                                return Boom.internal();
                            });
                        },function (error) {
                            console.log(error);
                            return Boom.badRequest(error);
                        });


                    }
                    else{
                        return Boom.badRequest('USER_DOEST_EXIST');
                    }
                });
            }
            else{
                return Boom.badRequest('NOT_AUTHENTICATED');
            }
        }
        catch (error){
            return Boom.badRequest(error.message);
        }
    }
};
exports.updateFriendList = {
    validate: {
        payload: {
            contacts:Joi.array()
        }
    },
    handler: async function (request, h) {
        try {
            if (request.auth.isAuthenticated) {
                return await  User.findOne({_id:request.auth.artifacts.userId}).then(function (user) {
                    if(user !== null) {
                       let contacts = request.payload.contacts;
                       return User.find({isVerified:true,mobileNumber:{$in:contacts}}).then(function (users) {
                           users.forEach(function (friend) {
                               user.friends.addToSet(friend._id);
                               user.save();
                               friend.friends.addToSet(user._id);
                               friend.save();
                           });
                           return {"successMessage":"friend list updated"};
                       });
                    }else {
                        return Boom.badRequest("Invalid user");
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
};
exports.restoreExistingProducts = {
    handler: async function (request, h) {
        try {
            if (request.auth.isAuthenticated) {
                return await  Product.find({userId:request.auth.artifacts.userId}).populate('productCategory').then(function (products) {
                    if(products !== null && products.length >0) {
                        return products;
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
exports.restoreExistingPlaces = {
    handler: async function (request, h) {
        try {
            if (request.auth.isAuthenticated) {
                return await  Place.find({userId:request.auth.artifacts.userId}).populate('placeCategory').then(function (products) {
                    if(products !== null && products.length >0) {
                        return products;
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
exports.getNearBy = {
    auth:false,
    handler: async function (request, h) {
        try {
            return Helper.getNearByPositions(null).then(function (nearBy) {
                console.log(nearBy);
                return nearBy;
            });
        }
        catch (error){
            return Boom.badRequest(error.message);
        }
    }
};
exports.restoreProfile = {
    handler: async function (request, h) {
        try {
            if (request.auth.isAuthenticated) {
                return await  User.findOne({userId:request.auth.artifacts.userId},'profileName profileImageUrl').then(function (user) {
                    if(user !== null) {
                        return {"user":user};
                    }else {
                        return {"user":null};
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




