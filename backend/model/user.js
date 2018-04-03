'use strict';

const GeoJSON = require('mongoose-geojson-schema');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Location = require('./location').Location;

/**
 * @module  User
 * @description contain the details of Attribute
 */

var UserSchema = new Schema({
    /**
     User MobileNumber. It can only contain string, is required and unique field which is indexed.
     */
    mobileNumber : { type: String },

    /**
     User Name. It can only contain string, is required field.
     */
    profileName : { type: String},

    profileImageUrl :{type: String},

    /**
     * Push notification ID for the user
     */
    pushNotificationId : { type: String},

    /**
      If has verified account
     */
    isVerified : {type:Boolean,default:false},

    verificationCode : {type:Number,max:999999,min:11111},

    requestVerificationCode : {type:Number,max:999999,min:11111},

    scope: {
        type: String,
        enum: ['CLIENT','SERVICE_PROVIDER'],
        default:'CLIENT'
    },
    /** for filtering user to filter*/
     friends:[{type:Schema.Types.ObjectId,ref:'User'}],

    /**Filter product category to filter*/
     trackProductCategory:[{type:Schema.Types.ObjectId,ref:'ProductCategory'}],

    /**Filter product brand to filter*/
     trackProductBrand:[{type:Schema.Types.ObjectId,ref:'ProductBrand'}],

    /**Track place categories*/
    trackPlaceCategory:[{type:Schema.Types.ObjectId,ref:'PlaceCategory'}],

    /**Track place service categories*/
    trackServiceCategory:[{type:Schema.Types.ObjectId,ref:'ProductBrand'}]

});

var user = Location.discriminator('user', UserSchema);

/** export schema */
module.exports = {
    User : user
};
