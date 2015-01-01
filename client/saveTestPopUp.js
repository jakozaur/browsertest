
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
    var id = Test.insert({
      userId: Meteor.userId(),
      name: name,
      code: code
    });
    Session.set('testId', id);
    Session.set('saveTestPopUp', false);
  },
  'click .cancel': function () {
    Session.set('saveTestPopUp', false);
  }
})
