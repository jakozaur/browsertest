Template.consoleLogs.helpers({
  logLines: function () {
    var runId = Session.get('runId');
    if (runId) {
      var logs = Run.findOne(runId).logs;
      logs = logs.join("").split("\n");
      console.log(logs);
      return _.map(logs, function (el) {
        return {line: el};
      });
    } else {
      return [];
    }
  }
});
