CodeGen = function () {
  var self = this;

  var debug = false;

  var pathEqual = function (a, b) {
    return JSON.stringify(a[0]) === JSON.stringify(b[0]);
  }

  self.eventsToNightwatch = function (events) {
    var lines = [];
    lines.push("module.exports = {");
    lines.push("  \"My awesome test\": function (browser) {");
    lines.push("    browser");

    for (var i = 0 ; i < events.length ;) {
      var step = 1;
      switch (events[i].type) {
        case 'url':
          lines.push("      .url(\"" + events[i].url + "\")");
          lines.push("      .waitForElementVisible(\"body\", 1000)")
          break;
        case 'click':
          // TODO: smarter selector
          var selector = events[i].path[0].id;
          lines.push("      .waitForElementVisible(\"" + selector + "\", 1000)")
          lines.push("      .click(\"#" + selector + "\")");
          break;
        case 'keydown':
          // TODO: detect special keys
          while (i + step < events.length &&
              pathEqual(events[i].path, events[i + step].path)) {
            step++;
          }
          var value = "";
          for (var j = 0 ; j < step ; j++) {
            var keyIdentifier = events[i + j].keyIdentifier;
            keyCode = parseInt(keyIdentifier.substr(2), 16);
            value += String.fromCharCode(keyCode);
          }
          // TODO: smarter selector
          lines.push("      .setValue(\"#" + events[i].path[0].id + "\", \"" +
            value + "\")")
          break;
      }
      i += step;
    }



    lines.push("      .end();");
    lines.push("  }");
    lines.push("};");

    if (debug) {
      _.each(events, function (e) {
        lines.push("// " + JSON.stringify(e));
      });
    }

    return lines.join("\n");
  }
};
