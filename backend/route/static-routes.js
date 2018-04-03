const Static    = require('../static');

exports.endPoints = [
  {method: 'GET',  path: '/{param*}', config: Static.get}
];
