'use strict';

const RegistrationRoutes = require('./registration-routes').endPoints;
const UserRoutes = require('./user-routes').endPoints;
const ProductRoutes = require('./product-routes').endPoints;
const PlaceRoutes = require('./place-routes').endPoints;
const StaticRoutes = require('./static-routes').endPoints;
const all = StaticRoutes.concat(RegistrationRoutes).concat(UserRoutes).concat(ProductRoutes).concat(PlaceRoutes);

exports.routes = all;

