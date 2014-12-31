Template.consoleLogs.helpers({
  logLines: function () {
    var runId = Session.get('runId');
    if (runId) {
      var logs = Run.findOne(runId).logs;
      logs = logs.join("");
      logs = ansi_up.escape_for_html(logs);
      logs = ansi_up.ansi_to_html(logs);
      logs = logs.split("\n");
      logs.shift();
      return logs.join("\n<br>");
    } else {
      return "";
    }
  }
});
