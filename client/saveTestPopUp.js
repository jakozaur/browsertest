
Template.saveTestPopUp.helpers({
  show: function () {
    return Session.get('saveTestPopUp');
  }
});

Template.saveTestPopUp.events({
  'click .save': function () {
    var name = $('#testNameInput').val();
    var code = $('#seleniumCode').val();
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
    Session.set('saveTestPopUp', false);
  }
})
