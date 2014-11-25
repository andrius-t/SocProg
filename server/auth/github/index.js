'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var router = express.Router();
var scope = ['user', 'repo', 'email'];

router
  .get('/', passport.authenticate('github', {
    scope: scope,
    failureRedirect: '/signup',
    session: false
  }))

  .get('/callback', passport.authenticate('github', {
    failureRedirect: '/signup',
    session: false
  }), auth.setTokenCookie)

  // Connect method (when user is logged in)
  .get('/connect', auth.isAuthenticated(), function (req, res, next) {
    passport.authorize('github', {
      scope: scope,
      session: false,
      failureRedirect: '/signup',
      callbackURL: config.github.callbackConnectUrl + '?access_token=' + req.query.access_token
    })(req, res, next);
  })

  // The callback after github has authorized the user
  .get('/connect/callback', auth.isAuthenticated(), passport.authorize('github', {
    failureRedirect: '/settings',
    session: false
  }), function (req, res) {
    res.redirect('/settings');
  });

module.exports = router;
