Template.codeButtons.events({
  'click .run-code': function () {
    var code = codeMirror.getValue();
    console.log("Run the code", code);
    Meteor.call('runCode', code, function (error, runId) {
      Session.set('runId', runId);
    });
  },
  'click .save-code': function () {
    var testId = Router.current().params.testId;
    if (testId) {
      Test.update(testId, {$set: {
        code: codeMirror.getValue()
      }});
    } else {
      Session.set('saveTestPopUp', true);
    }
  },
  'click .show-examples': function () {
    Session.set('examplesPopUp', true);
  },
});
