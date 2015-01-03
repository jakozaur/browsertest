window.addEventListener('click', function (event) {
  console.log("BrowserTest click", event);
  var exported = {
    x: event.x,
    y: event.y
  };
  // TODO: export rest of interesting properties
  chrome.runtime.sendMessage(['click', exported]);
}, true);

window.addEventListener('keydown', function (event) {
  console.log("BrowserTest keydown", event);
  var exported = {
    charCode: event.charCode,
    keyIdentifier: event. keyIdentifier
  };
  // TODO: export rest of interesting properties
  chrome.runtime.sendMessage(['keydown', exported]);
}, true);
