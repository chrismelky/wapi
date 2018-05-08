'use strict';

const user = require('../models/user').User;
const Helper = require('../Helper');

const createNewUser = (userInfo) => {
    let newUser = new user(userInfo);
    return  newUser.save();
}

const updateUser = (userId,userInfo) => {
    return user.findOneAndUpdate({_id:userId},{$set:userInfo},{new: true});
}

const register = (userInfo) => {
    return user.findOne(userInfo).then((user) => {
        if(user === null){
            return createNewUser(userInfo);
        }
        else{
            return new Promise((resolve,reject) => {
                resolve(user);
            });
        }
    }).then((user)=>{
        //Generate verification code
        let requestVerificationCode =  Helper.generateUserVerificationCode();
        return updateUser(user._id,{requestVerificationCode:requestVerificationCode});
    }).then((user)=>{
        Helper.sendVerificationSMS(user.phoneNumber,user.requestVerificationCode);
        return  {"successMessage":"Account Created or Updated"};
    });
};

const resendVerificationCode = (userInfo) => {
    return user.findOne(userInfo).then((user) => {
        if (user === null || user === undefined) {
            return new Promise((resolve, reject) => {
                reject("USER_DOEST_EXIST");
            });
        }
        let requestVerificationCode = Helper.generateUserVerificationCode();
        return updateUser(user._id, {requestVerificationCode: requestVerificationCode});
    }).then((user) => {
        Helper.sendVerificationSMS(user.phoneNumber,user.requestVerificationCode);
        console.info(user.requestVerificationCode);
        return {"successMessage": "VERIFICATION_CODE_RESENT"};
    });
};

const verify = (verificationInfo) => {
    return  user.findOne(verificationInfo).then(function (user) {
        if (user === null || user === undefined) {
            return new Promise((resolve, reject) => {
                reject("INVALID_VERIFICATION");
            });
        }
        return Helper.createUserDirectories(user);
    }).then((user) =>{
        return updateUser(user.id,{isVerified:true,verificationCode:user.requestVerificationCode});
    }).then((user) => {
        let token = Helper.generateUserToken(user);
        return {"token":token,"successMessage":"USER_VERIFIED_SUCCESSFUL","userId":user._id};
    });
};

/** export Model */
module.exports = {
    register : register,
    resendVerificationCode : resendVerificationCode,
    verify : verify
};
