const Static    = require('./static');
const User      = require('./controller/usercontroller');

exports.endPoints = [
  {method: 'GET',  path: '/{param*}', config: Static.get},
  { method: 'POST', path: '/user', config: User.create},
  {method: 'GET',  path: '/users', config: User.getAll},
  {method: 'GET',  path: '/user/{userId}', config: User.getOne}
];
