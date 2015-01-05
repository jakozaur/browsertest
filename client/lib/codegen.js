CodeGen = function () {
  var self = this;

  var debug = false;

  var pathEqual = function (a, b) {
    return JSON.stringify(a[0]) === JSON.stringify(b[0]);
  }

  var generateSelector = function(event) {
    var result = [];
    for (var i = 0 ; i < event.path.length ; ++i) {
      var node = event.path[i];
      if (node.id) {
        result.push("#" + node.id);
        break;
      } else {
        if (node.className) {
          result.push("." + node.className.split(" ").join(".") +
            ":nth-child(" + node.childIndex + ")");
        } else {
          result.push(node.tagName.toLowerCase() +
            ":nth-child(" + node.childIndex + ")");
        }
      }
    }
    result.reverse();
    return result.join(" ");
  }

  var generateText = function(events) {
    var result = [];
    var value = "";
    for (var i = 0 ; i < events.length ; i++) {
      if (events[i].keyIdentifier == 'Enter') {
        result.push("\"" + value + "\"");
        result.push("browser.Keys.ENTER")
        value = "";
      } else {
        value += String.fromCharCode(events[i].charCode);
      }
    }
    result.push("\"" + value + "\"");
    result = _.filter(result, function (e) { return e.length > 2; });
    if (result.length > 1) {
      return "[" + result.join(", ") + "]";
    } else {
      return result[0];
    }
  }

  self.eventsToNightwatch = function (originalEvents) {
    var lines = [];
    lines.push("module.exports = {");
    lines.push("  \"My awesome test\": function (browser) {");
    lines.push("    browser");

    var events = _.filter(originalEvents, function(e) {
      return e.type !== 'keydown';
    });

    for (var i = 0 ; i < events.length ;) {
      var step = 1;
      switch (events[i].type) {
        case 'url':
          lines.push("      .url(\"" + events[i].url + "\")");
          lines.push("      .waitForElementVisible(\"body\", 1000)")
          break;
        case 'click':
          var selector = generateSelector(events[i]);
          lines.push("      .waitForElementVisible(\"" + selector + "\", 1000)")
          lines.push("      .click(\"" + selector + "\")");
          break;
        case 'keypress':
          // TODO: detect special keys
          while (i + step < events.length &&
              events[i + step].type == 'keypress' &&
              pathEqual(events[i].path, events[i + step].path)) {
            step++;
          }
          var text = generateText(events.slice(i, i + step));
          var selector = generateSelector(events[i]);
          lines.push("      .setValue(\"" + selector + "\", " + text + ")");
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
