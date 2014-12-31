var loginOptions = {
  requestPermissions: {
    github: ['user:email']
  }
};

Accounts.ui.config(loginOptions);

Template.pitchPart.events({
  'click .signUp button': function () {
    if (Meteor.userId()) {
      Router.go('app');
    } else {
      Meteor.loginWithGithub(loginOptions, function (err) {
        if (!err) {
          Router.go('app');
        }
      });
    }
  }
})
