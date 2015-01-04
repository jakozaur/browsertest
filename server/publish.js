Meteor.publish('myTests', function (userId) {
  return Test.find({userId: this.userId});
});

Meteor.publish('myRecording', function (userId, recordingId) {
  return Recording.find({_id: recordingId, userId: this.userId});
});

Meteor.publish('myRun', function (userId, runId) {
  return Run.find({_id: runId, userId: this.userId});
});
