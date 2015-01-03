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
    if (!codeMirror.hasFocus() && testId) {
      var test = Test.findOne(testId);
      if (test) {
        codeMirror.setValue(test.code);
      }
    }
  });
};
