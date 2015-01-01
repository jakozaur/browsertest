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
      // TODO: popup to get name
      var name = "My awesome test";
      var code = $('#seleniumCode').val();
      var id = Test.insert({
        userId: Meteor.userId(),
        name: name,
        code: code
      });
      Session.set('testId', id);
    }
  }
});
