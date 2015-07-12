Template.consoleLogs.helpers({
  logLines: function () {
    var runId = Session.get('runId');
    var run = Run.findOne(runId);
    if (run) {
      var logs = run.logs;
      logs = logs.join("");
      logs = ansi_up.escape_for_html(logs);
      logs = ansi_up.ansi_to_html(logs);
      logs = logs.split("\n");
      logs.shift();
      return logs.join("\n<br>");
    } else {
      return "";
    }
  },
  screenshots: function() {
    var runId = Session.get('runId');
    var run = Run.findOne(runId);
    if (run) {
      var result = [];
      _.each(run.screenshots || [], function (id) {
        var image = Images.findOne(id);
        if (image) {
          result.push(image);
        }
      });
      return result;
    } else {
      return [];
    }
  }

});
