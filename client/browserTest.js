Template.browsertest.helpers({
  testName: function () {
    var testId = Router.current().params.testId;
    if (testId) {
      var test = Test.findOne(testId);
      return test && test.name;
    } else {
      return "";
    }
  }
});

Template.browsertest.events({
  'click .recording': function () {
    Meteor.call('recordTest');
  }
});
