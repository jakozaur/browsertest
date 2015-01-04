Template.browsertest.helpers({
  testName: function () {
    var testId = Router.current().params.testId;
    if (testId) {
      var test = Test.findOne(testId);
      return test && test.name;
    } else {
      return "";
    }
  },
  isRecording: function () {
    var recordingId = Router.current().params.recordingId;
    if (recordingId) {
      return true;
    } else {
      return false;
    }
  }
});

Template.browsertest.events({
  'click .start-recording': function () {
    Meteor.call('recordTest', function (err, recordingId) {
      Router.go('app.recordingId', {recordingId: recordingId});
    });
  },
  'click .stop-recording': function () {
    Meteor.call('stopBrowser');
    Router.go('app');
  }
});







