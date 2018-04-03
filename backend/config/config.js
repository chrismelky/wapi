'use strict';

module.exports = {
  server: {
    host: '127.0.0.1',
    port: 3000
  },
  database: {
  	host: '127.0.0.1',
    port: 27017,
    db: 'wapi',
    username: '',
    password: '',
    url : 'mongodb://<user>:<password>@<url>'
  },
  jwt:{
      privateKey:'joshinho'
  },
    smsGateway:{
       url:"http://smpp.logitechsms.com:8080/api?action=sendmessage&username=wapi&password=wapi123&messagetype=SMS:TEXT"
    }
};
