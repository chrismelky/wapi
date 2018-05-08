const PlaceCategory = require('../controllers/place-category-controller')
exports.endPoints = [
    {method: 'POST',  path: '/places/categories/create', config: PlaceCategory.create},
    {method: 'GET',  path: '/places/categories/get', config: PlaceCategory.get},
];
