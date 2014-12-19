'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var githubApi = require('github');
var User = require('../user/user.model');

var RepoSchema = new Schema({
  /*id : {type:String},
  events: {type: Array}*/
  id: {type:String},
  type: {type:String},
  actor: {},
  repo: {},
  payload: {},
  public: {type:Boolean},
  created_at: {type:Date}

});

RepoSchema.methods = {
  updateGitHubEvents: function(){
    // Issaugojimas
    // http://stackoverflow.com/questions/15921700/mongoose-unique-values-in-nested-array-of-objects
    User.find({}, function(){

    });
    User.find({"github.token": {$not: {$size: 0}}}, 'name picture follows', function(err, user) {
      if (err) return err;
      if (!user) return res.json(401);
      console.log(user);
    });
    var _this = this;
    user.githubApi().events.getFromUserPublic({
      user: user.github.profile.login
      //headers : {
      //  'If-None-Match' : '"da7e3a808716c4e2b82361b167226d69"' // naudoji etag
      //}
    }, function(err, res) {

      // filter out the events we need from github
      var events = res.filter(function(event){
        return event.type === 'PushEvent';
      });

      _this.addToSet(events);

      _this.save(function (err) {
        //saved!
      });

      // console.log(req.user);
      //return res.json(events);
    });
  }

};

module.exports = mongoose.model('Repo', RepoSchema);