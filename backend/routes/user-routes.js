const User      = require('../controllers/user-controller');

exports.endPoints = [
    {method: 'GET',  path: '/users', config: User.getAll},
    {method: 'POST', path: '/users/update-profile-picture', config: User.uploadProfilePicture},
    {method: 'PUT', path: '/users/update-location', config: User.updateUserLocation},
    {method: 'PUT',  path: '/users/update-push-notification-id', config: User.updatePushNotificationId},
    {method: 'PUT',  path: '/users/update-profile-name', config: User.updateProfileName},
    {method: 'PUT',  path: '/users/update-friend-list', config: User.updateFriendList},
    {method: 'GET',  path: '/users/restore-existing-products', config: User.restoreExistingProducts},
    {method: 'GET',  path: '/users/restore-profile', config: User.restoreProfile},
    {method: 'GET',  path: '/nearBy', config: User.getNearBy}
];
