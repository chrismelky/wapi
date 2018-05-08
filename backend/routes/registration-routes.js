const registration      = require('../controllers/registration-controller');

exports.endPoints = [
    {method: 'POST', path: '/users', config: registration.register},
    {method: 'POST',  path: '/users/resend-verification-code', config: registration.resendVerificationCode},
    {method: 'POST',  path: '/users/verify', config: registration.verifyUser}
];
