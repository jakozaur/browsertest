
Template.saveTestPopUp.helpers({
  show: function () {
    return Session.get('saveTestPopUp');
  },
  error: function () {
    return Session.get('saveTestPopUpError');
  }
});

Template.saveTestPopUp.events({
  'click .save': function () {
    var name = $('#testNameInput').val();
    var code = $('#seleniumCode').val();
    if (name.length == 0) {
      Session.set('saveTestPopUpError', "Please enter the name");
      return;
    }
    Session.set('saveTestPopUpError', null);
    // TODO: check if name is unique?
    var testId = Test.insert({
      userId: Meteor.userId(),
      name: name,
      code: code
    });
    Session.set('saveTestPopUp', false);
    Router.go('app.testId', {testId: testId});
  },
  'click .cancel': function () {
    Session.set('saveTestPopUpError', null);
    Session.set('saveTestPopUp', false);
  },
  'click .overlay': function () {
    Session.set('saveTestPopUpError', null);
    Session.set('saveTestPopUp', false);
  }
})
