'use strict';
const JWT = require('jsonwebtoken');
const config = require('./config/config');
const axios = require('axios');
const Location = require('./models/location').Location;
const Path = require('path');
const fs = require("fs");


exports.generateUserVerificationCode = function () {
    let time =(Math.floor((new Date().getTime()/1000))).toString();
    return parseInt(time.substr(time.length - 6),10);
};
exports.sendVerificationSMS = async function (phoneNumber, code) {
    let url = config.smsGateway.url+"&recipient="+phoneNumber+"&messagedata="+code;
    return axios.get(url);
};
exports.generateUserToken =  (user) => {
    //TODO implement time token for payment period
   let tokenData ={ phoneNumber:user.phoneNumber,verificationCode:user.requestVerificationCode };
   let token =JWT.sign(tokenData,config.jwt.privateKey);
   return token;
};
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
    }).select({'phoneNumber':1,pushNotificationId:1,'productCategoryId':1,'profileName':1,'name':1,'soh':1,location:1,images:1,profileImageUrl:1});
};
exports.createUserDirectories = (user) => {
    return new Promise((resolve, reject) => {
        try{
            let baseDir = Path.join(__dirname, '..'+'/backend/uploads/location/');
            let userDir = baseDir+user._id;
            let profileDir = userDir+'/profile';
            let productDir = userDir+'/products';
            let placeDir = userDir+'/places';
            let eventDir = userDir+'/events';
            if (!fs.existsSync(userDir)){
                fs.mkdirSync(userDir);
            }
            if (!fs.existsSync(profileDir)){
                fs.mkdirSync(profileDir);
            }
            if (!fs.existsSync(productDir)){
                fs.mkdirSync(productDir);
            }
            if (!fs.existsSync(placeDir)){
                fs.mkdirSync(placeDir);
            }
            if (!fs.existsSync(eventDir)){
                fs.mkdirSync(eventDir);
            }
            resolve(user);
        }
        catch(error){
            console.error(error);
            reject('ERROR_CREATING_USER_DIRECTORIES');
        }
    });

}




exports.getAuthMock =function () {
    return {isAuthenticated:true,artifacts:{userId:'5a3bdab416f3c55058d427d1'}};
}
//productID; 5a71f6c938b1881c4faac448