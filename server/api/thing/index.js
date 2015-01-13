'use strict';

var express = require('express');
var controller = require('./thing.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/count/:id', auth.isAuthenticated(), controller.count);
router.get('/group/:id', auth.isAuthenticated(), controller.group);
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
////////////
//////////// profile sockets
////////////
router.get('/profile/:id', auth.isAuthenticated(), controller.profileIndex);

module.exports = router;
