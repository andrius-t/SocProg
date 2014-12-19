'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/navbar', auth.isAuthenticated(), controller.navbar);
router.get('/follows', auth.isAuthenticated(), controller.follows);
router.get('/search/:id', auth.isAuthenticated(), controller.searchs);
router.get('/followers/:id', auth.isAuthenticated(), controller.followers);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/notification', auth.isAuthenticated(), controller.noti);
router.post('/message', auth.isAuthenticated(), controller.message);
router.post('/addfollower', auth.isAuthenticated(), controller.addfollower);
router.post('/removefollower', auth.isAuthenticated(), controller.removefollower);
router.post('/github/addfollower', auth.isAuthenticated(), controller.github_addfollower);
router.post('/github/removefollower', auth.isAuthenticated(), controller.github_removefollower);
router.post('/image', auth.isAuthenticated(), controller.image);

module.exports = router;
