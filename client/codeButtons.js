Template.codeButtons.events({
  'click .run-code': function () {
    var code = $('#seleniumCode').val();
    console.log("Run the code", code);
    Meteor.call('runCode', code, function (error, runId) {
      Session.set('runId', runId);
    });
  },
  'click .save-code': function () {
    var testId = Session.get('testId');
    if (testId) {
      // TODO: update existing code
    } else {
      Session.set('saveTestPopUp', true);
    }
  }
});
