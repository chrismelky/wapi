'use strict';
const Hapi = require('hapi');
const Path = require('path');
const Inert = require('inert');
const StaticRoutes = require('./route/static-routes');
const UserRoutes = require('./route/user-routes');
const ProductRoutes = require('./route/product-routes');
const PlaceRoutes = require('./route/place-routes');
const Db = require('./config/db');
const config = require('./config/config');
const User = require('./model/user').User;

/** Define server at pot 4000 with CORS enabled for all routes**/
const server = new Hapi.Server({
    port: 4000,
  	routes: {
      cors: {origin:['*']},
      files: {
        relativeTo: Path.join(__dirname, './')
      }
  },
});

const validatorw = async (request, token, h) => {
  let isValid, artifacts={};
  const credentials = token.decodedJWT;
  try {
    return await User.findOne({mobileNumber:credentials.mobileNumber,verificationCode:credentials.verificationCode}).then((user)=>{
    if(user && user.isVerified){
      isValid = true;
      artifacts.userId = user._id;
      return { isValid, credentials, artifacts};
    }
    else{
      isValid = false;
      artifacts.error = "Not valid user"
      return { isValid, credentials, artifacts };
    }
    });
    }
    catch (error){
        isValid = false;
        artifacts.error = error
        return { isValid, credentials, artifacts };
    }
};

const validator = async(decoded, request) => {
    console.log(decoded);
    try {
        return await User.findOne({mobileNumber:decoded.mobileNumber,isVerified:true}).
        then((user)=>{
            if(user){
                return { isValid:true,userId:user.userId};
            }
            else{
                return { isValid:false};
            }
        });
    }
    catch (error){
        console.log(error);
        return { isValid:false};
    }
};

const start = async () => {
    try {
        await server.register([
            {plugin:Inert},
            {plugin:require('hapi-auth-jwt2')}
            ]);
    }
    catch (error){
        console.log(error);
        process.exit(1);
    }

    server.auth.strategy('jwt', 'jwt', {
        key: config.jwt.privateKey,
        validate: validator,
        verifyOptions: { algorithms: [ 'HS256' ] }
    });

    server.auth.default('jwt');
    var routes = StaticRoutes.endPoints.concat(UserRoutes.endPoints).concat(ProductRoutes.endPoints).concat(PlaceRoutes.endPoints);
    server.route(routes);

    try{
        await server.start();
        console.log('Server running at:', server.info.uri);
    }
    catch (error){
        console.log(error);
        process.exit(1);
    }
};

start();
