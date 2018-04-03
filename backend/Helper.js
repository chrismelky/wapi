'use strict';
const JWT = require('jsonwebtoken');
const config = require('./config/config');
const User = require('./model/user').User;
const axios = require('axios');
const Location = require('./model/location').Location;
const Boom = require('boom');

exports.generateUserVerificationCode = function () {
    let time =(Math.floor((new Date().getTime()/1000))).toString();
    return parseInt(time.substr(time.length - 6),10);
};
exports.sendVerificationSMS = async function (mobileNumber, code) {
    let url = config.smsGateway.url+"&recipient="+mobileNumber+"&messagedata="+code;
    return axios.get(url);
};
exports.generateUserToken = function (user) {
    //TODO implement time token for payment period
   let tokenData ={ mobileNumber:user.mobileNumber,verificationCode:user.requestVerificationCode };
   let token =JWT.sign(tokenData,config.jwt.privateKey);
   console.log(token);
   return token;
}

exports.getNearByPositions = async function (longitude,latitude,user) {
    return Location.find({
        $and:[{
        location:{
                  $near:
                      {
                          $geometry: {type: "Point", coordinates: [longitude, latitude]},
                          $maxDistance: 5000,
                      },

        }},{
            $or: [
                { kind: 'user', _id:{$in:user.friends}},
                { kind: 'product',userId:{$ne:user._id} }
            ]}
       ]
    }).select({'mobileNumber':1,pushNotificationId:1,'productCategoryId':1,'profileName':1,'name':1,'soh':1,location:1,images:1,profileImageUrl:1});
}



exports.getAuthMock =function () {
    return {isAuthenticated:true,artifacts:{userId:'5a3bdab416f3c55058d427d1'}};
}
//productID; 5a71f6c938b1881c4faac448