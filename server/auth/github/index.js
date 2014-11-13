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

//TODO add Connect method (when user is logged in)
//send to google to do the authentication
  .get('/connect', passport.authorize('github', { scope : scope }))

//the callback after google has authorized the user
  .get('/connect/callback',
  passport.authorize('google', {
    successRedirect : '/settings',
    failureRedirect : '/settings'
  }));

//TODO add Unlink method ? (NO)
//app.get('/unlink', isLoggedIn, function(req, res) {
//  var user          = req.user;
//  user.google.token = undefined;
//  user.save(function(err) {
//    res.redirect('/profile');
//  });
//});

module.exports = router;
