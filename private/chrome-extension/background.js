var events = [];

chrome.webNavigation.onCommitted.addListener(function (details) {
  if (details.transitionType === 'reload') {
    console.log("Refresh", details);
  } else if (details.transitionQualifiers.indexOf('forward_back') !== -1) {
    console.log("Forward/backward", details);
    // TODO: we always assume backward
  } else if (details.transitionQualifiers.indexOf('from_address_bar') !== -1) {
    console.log("Typed new url", details.url, details);
    // handle redirects
  }
});


chrome.webNavigation.onReferenceFragmentUpdated.addListener(function (details) {
  console.log("onReferenceFragmentUpdated", details);
  /// ???
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("onMessage", request, sender);
});
