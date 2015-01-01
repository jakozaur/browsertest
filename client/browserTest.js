Template.browsertest.helpers({
  testName: function () {
    var testId = Session.get('testId');
    if (testId) {
      var test = Test.findOne(testId);
      return test && test.name;
    } else {
      return "";
    }
  }
});
