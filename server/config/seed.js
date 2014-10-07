///**
// * Populate DB with sample data on server start
// * to disable, edit config/environment/index.js, and set `seedDB: false`
// */
//
//'use strict';
//
//var Thing = require('../api/thing/thing.model');
//var User = require('../api/user/user.model');
//
//var adminId = '5433ffdc2f1d7620542d939a';
//var userId = '5433ffdd2f1d7620542d939b';
//
//User.find({}).remove(function() {
//  User.create({
//        _id : adminId,
//        provider: 'local',
//        name: 'Test User',
//        email: 'test@test.com',
//        password: 'test'
//      }, {
//        _id : userId,
//        provider: 'local',
//        role: 'admin',
//        name: 'Admin',
//        email: 'admin@admin.com',
//        password: 'admin'
//      }, function() {
//        console.log('finished populating users');
//      }
//  );
//});
//
//Thing.find({}).remove(function() {
//  Thing.create({
//    name : 'Development Tools',
//    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.',
//    user: adminId
//  }, {
//    name : 'Server and Client integration',
//    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.',
//    user: adminId
//  }, {
//    name : 'Smart Build Systemm',
//    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html',
//    user: adminId
//  },  {
//    name : 'Modular Structure',
//    info : 'Best practice client and server structures allow for more code reusability and maximum scalability',
//    user: userId
//  },  {
//    name : 'Optimized Build',
//    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.',
//    user: userId
//  },{
//    name : 'Deployment Ready',
//    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators',
//    user: adminId
//  }, function(){
//    console.log('finished populating things');
//  });
//});
//
