Template.popUp.events({
  'click #intro1 button': function () {
    Session.set('showSecondIntro', true);
  },
  'click #intro2 button': function () {
    Meteor.users.update(Meteor.userId(), {$set: {
      'profile.skipWelcome': true
    }});
  },
  'click .overlay': function () {
    Meteor.users.update(Meteor.userId(), {$set: {
      'profile.skipWelcome': true
    }});
  }
});

Template.popUp.helpers({
  showWelcome: function () {
    if (Meteor.user() && !Meteor.user().profile.skipWelcome) {
      return true; 
    } else {
      return false;
    }
  }, 
  showIntro1: function () {
    if (Meteor.user() && !Meteor.user().profile.skipWelcome) {
      return !Session.get('showSecondIntro');
    } else {
      return false;
    }
  },
  showIntro2: function () {
    if (Meteor.user() && !Meteor.user().profile.skipWelcome) {
      return Session.get('showSecondIntro');
    } else {
      return false;
    }
  }
}); 







