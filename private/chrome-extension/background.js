var events = [];

var EventRecorder = function () {
  var self = this;
  var url = Settings.meteorUrl + '/test/record/' + Settings.testId;
  self._pendingEvents = [];
  self._isSending = false;

  var flush = function () {
    console.log("Flush", self._isSending, self._pendingEvents.length);
    if (!self._isSending && self._pendingEvents.length > 0) {
      self._isSending = true;
      var eventsToSent = self._pendingEvents;
      self._pendingEvents = [];

      var request = new XMLHttpRequest();

      request.open('POST', url, true);
      request.onload = function () {
        self._isSending = false;
        flush();
      };
      request.send(JSON.stringify(eventsToSent));
    }
  }

  this.send = function (event) {
    console.log("Sending event", event);
    self._pendingEvents.push(event);

    flush();
  }
}

var recorder = new EventRecorder();



chrome.webNavigation.onCommitted.addListener(function (details) {
  if (details.transitionType === 'reload') {
    console.log("Refresh", details);
    recorder.send({
      type: 'refresh'
    });
  } else if (details.transitionQualifiers.indexOf('forward_back') !== -1) {
    console.log("Forward/backward", details);
    // TODO: detect forward, now we always assume backward
    recorder.send({
      type: 'backward'
    });
  } else if (details.transitionQualifiers.indexOf('from_address_bar') !== -1) {
    console.log("Typed new url", details.url, details);
    // TODO: recognize the original typed url, now we can have redirected one
    recorder.send({
      type: 'url',
      url: details.url
    });
  }
});


//chrome.webNavigation.onReferenceFragmentUpdated.addListener(function (details) {
  //log("onReferenceFragmentUpdated", details);
  /// ???
//});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("onMessage", request, sender);
  recorder.send(request);
});
