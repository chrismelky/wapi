const Product = require('../controllers/product-controller');
const ProductCategory = require('../controllers/product-category-controller');

exports.endPoints = [
    {method: 'POST',  path: '/products/categories/create', config: ProductCategory.create},
    {method: 'GET',  path: '/products/categories/get', config: ProductCategory.get},
    {method: 'POST',  path: '/products/save', config: Product.save},
    {method: 'POST',  path: '/products/upload-picture', config: Product.uploadPicture},
    {method: 'PUT',  path: '/products/remove-picture', config: Product.removePicture},
    {method: 'PUT',  path: '/products/set-default-picture', config: Product.setDefaultPicture},
];
