(function () {
  var exportPath = function (event) {
    var result = [];
    var node = event.target;
    while (node) {
      var childIndex = undefined;
      if (node.parentNode) {
        childIndex = Array.prototype.indexOf.call(node.parentNode.children, node);
      }
      result.push({
        id: node.id,
        className: node.className,
        tagName: node.tagName,
        childIndex: childIndex
      });
      node = node.parentNode;
    }
    return result;
  }

  var log = function () {};
  // log = console.log

  window.addEventListener('click', function (event) {
    log("BrowserTest click", event);
    var exported = {
      type: 'click',
      x: event.x,
      y: event.y,
      path: exportPath(event)
    };
    console.log(exported);
    chrome.runtime.sendMessage(exported);
  }, true);

  window.addEventListener('keydown', function (event) {
    log("BrowserTest keydown", event);
    var exported = {
      type: 'keydown',
      charCode: event.charCode,
      keyIdentifier: event.keyIdentifier,
      path: exportPath(event)
    };
    chrome.runtime.sendMessage(exported);
  }, true);

  window.addEventListener('keypress', function (event) {
    log("BrowserTest keypress", event);
    var exported = {
      type: 'keypress',
      charCode: event.charCode,
      keyIdentifier: event.keyIdentifier,
      path: exportPath(event)
    };
    chrome.runtime.sendMessage(exported);
  }, true);
}());
