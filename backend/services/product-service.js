'use strict';

const Product = require('../models/product').Product;
const User = require('../models/user').User;
const Place = require('../models/place').Place;
const fs = require("fs");
const Path = require('path');
const uuidV1 = require('uuid/v1');

/**
 * Create new product if doesn't exist by user , name and category
 * @param productInfo
 * @returns {Promise.<Product>}
 */

const throwError = (error) =>{
    return new Promise((resolve, reject) => {
        reject(error);
    })
};

const save = (productInfo) => {
    if(productInfo._id === undefined) {
        let searchBy =(productInfo.locationType === 'USER')
            ?{userId: productInfo.userId,name: productInfo.name, productCategoryId: productInfo.productCategoryId}
            :{placeId:productInfo.placeId,name: productInfo.name, productCategoryId: productInfo.productCategoryId};
        return Product.findOne(searchBy).then((product) => {
            if (product !== null) {
                return throwError('PRODUCT_EXISTS');
            }
            else {
                let product = new Product(productInfo);
                product.transactions.push({quantity:productInfo.soh,transactionType:'CREDIT',reason:'BUY'});
                return product.save();
            }
        }).then((product) => {
            return updateLocation(product);
        });
    }
    else {
        return update(productInfo);
    }
};

const update = (productInfo) => {
    return Product.findOne({_id:productInfo._id}).then((product) => {
        if(productInfo.soh !== product.soh){
            let qDiff = productInfo.soh - product.soh;
            let tType = (qDiff > 0)?'CREDIT':'DEBIT';
            product.transactions.push({quantity:Math.abs(qDiff),transactionType:tType});
        }
        product.set(productInfo);
        return product.save();
    }).then(product => {
        return updateLocation(product);
    });
}

const updateLocation = (product) => {
    if(product.locationType === undefined){
        return throwError('INVALID_LOCATION_TYPE');
    }
    else if(product.locationType === 'USER'){
        return User.findOne({_id:product.userId}).then((user) => {
            product.set({location:{type:"Point",coordinates:user.location.coordinates}});
            return product.save();
        }).then((product) => {
            return product;
        });
    }
    else if(product.locationType === 'PLACE') {
        return Place.findOne({_id:product.placeId}).then((place) => {
            if(place === null) {
                return throwError('INVALID_PLACE');
            }
            else {
                product.set({location: {type: "Point", coordinates: place.location.coordinates}});
                return product.save();
            }
        }).then((product) => {
            return product;
        });
    }

}

const saveImageFile = (product,file) => {
    let locationId = (product.locationType === 'USER')?product.userId:product.placeId;
    let imageId =uuidV1();
    let imageUrl ='/uploads/location/'+locationId+'/products/'+imageId+'.png';
    let imageUri = Path.join(__dirname, '..'+imageUrl);
    if(locationId === undefined){
        return throwError('INVALID_LOCATION');
    }
    return new Promise( (resolve,reject) => {
        file.on('error',  (error) => {
            console.log(error.message);
            reject(error.message) ;
        });
        try {
            file.pipe(fs.createWriteStream(imageUri));
        }
        catch (error){
            console.error(error.message);
            reject(error.message);
        }
        file.on('end',  (error) => {
            if(error){
                console.error(error);
                reject(error.message);
            }
            let isDefault =(product.images.length === 0);
            product.images.addToSet({uri: imageUrl, isDefault: isDefault});
            resolve(product.save());
        });
    });
}

const uploadPicture = (data) => {
    return Product.findOne({_id:data['productId']}).then((product) => {
        if(product === null){
            return throwError('PRODUCT_DOES_NOT_EXIST');
        }
        else{
            let file = data["productPic"];
            if(product.images.length === 6){
                return throwError('MAX_IMAGE_REACHED');
            }else {
                return saveImageFile(product,file);
            }
        }
    }).then((product)=>{
        return product;
    });
}

module.exports = {
    save : save,
    uploadPicture:uploadPicture
}