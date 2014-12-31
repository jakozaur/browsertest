Template.codeButtons.events({
  'click .run-code': function () {
    var code = $('#seleniumCode').val();
    console.log("Run the code", code);
    Meteor.call('runCode', code, function (error, runId) {
      Session.set('runId', runId);
    });
  }
});
