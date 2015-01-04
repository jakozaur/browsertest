codeMirror = {};

Template.code.helpers({
  currentCode: function () {
    return "\
module.exports = {\n\
  \"Demo test Google\" : function (browser) {\n\
    browser\n\
      .url('http://www.google.com')\n\
      .waitForElementVisible('body', 1000)\n\
      .setValue('input[type=text]', 'nightwatch')\n\
      .waitForElementVisible('button[name=btnG]', 1000)\n\
      .click('button[name=btnG]')\n\
      .pause()\n\
      .assert.containsText('#main', 'The Night Watch')\n\
      .end();\n\
  }\n\
};\n\
";
  }
});

Template.code.created = function () {
  this.autorun(function () {
    var height = NoVnc.size.get().height;
    if (height) {
      $('.browserView').height(height + 'px');
      $('.code').height(height + 'px');
    }
  });
};

Template.code.rendered = function () {
  var self = this;
  codeMirror = CodeMirror.fromTextArea(this.find("#seleniumCode"), {
    mode: 'javascript',
    lineNumbers: true
  });

  self.autorun(function () {
    var testId = Router.current().params.testId;
    var recordingId = Router.current().params.recordingId;
    if (!codeMirror.hasFocus() && testId) {
      codeMirror.setOption('readOnly', false);
      codeMirror.setOption('theme', 'default');

      var test = Test.findOne(testId);
      if (test) {
        codeMirror.setValue(test.code);
      }
    } else if (recordingId) {
      var recording = Recording.findOne(recordingId) || {};
      var events = recording.events || [];
      var gen = new CodeGen();
      var code = gen.eventsToNightwatch(events);
      codeMirror.setOption('readOnly', true);
      codeMirror.setOption('theme', 'base16-light');
      codeMirror.setValue(code);
    } else {
      codeMirror.setOption('readOnly', false);
      codeMirror.setOption('theme', 'default');
    }
  });
};
