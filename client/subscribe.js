Tracker.autorun(function () {
  Meteor.subscribe('myTests', Meteor.userId());
  Meteor.subscribe('myRun', Meteor.userId(), Session.get('runId'));
  var current = Router.current();
  if (current) {
    Meteor.subscribe('myRecording', Meteor.userId(),
      current.params.recordingId);
  }
});
