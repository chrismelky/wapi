const Product = require('../controller/product-controller');
const ProductCategory = require('../controller/product-category-controller');

exports.endPoints = [
    {method: 'POST',  path: '/products/categories/create', config: ProductCategory.create},
    {method: 'GET',  path: '/products/categories/get', config: ProductCategory.get},
    {method: 'POST',  path: '/products/create', config: Product.create},
    {method: 'PUT',  path: '/products/update', config: Product.update},
    {method: 'POST',  path: '/products/upload-picture', config: Product.uploadPicture},
    {method: 'PUT',  path: '/products/remove-picture', config: Product.removePicture},
    {method: 'PUT',  path: '/products/set-default-picture', config: Product.setDefaultPicture},
];
