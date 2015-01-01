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
      Test.update(testId, {$set: {
        code: $('#seleniumCode').val()
      }});
    } else {
      Session.set('saveTestPopUp', true);
    }
  }
});
