Template.examplesPopUp.helpers({
  show: function () {
    return Session.get('examplesPopUp');
  }
});

Template.examplesPopUp.events({
  'click .close-examples': function () {
    Session.set('examplesPopUp', false);
  },
  'click .overlay': function () {
    Session.set('examplesPopUp', false);
  },
  'click #example-1': function () {
    Session.set('examplesPopUp', false);
    Router.go('app');
    codeMirror.setValue("module.exports = {\n\
  \'Search on Amazon\': function (browser) {\n\
    browser\n\
      .url(\"http://www.amazon.com\")\n\
      .waitForElementVisible(\"body\", 1000)\n\
      .pause(1000)\n\
      .setValue(\"input[name=field-keywords]\",\n\
                \"How to win friends and influence people\")\n\
      .click(\'input[type=submit]\')\n\
      .assert.elementPresent(\"#nav-cross-shop\")\n\
      .assert.elementPresent(\"#topDynamicContent\")\n\
      .assert.elementPresent(\"#leftNavContainer\")\n\
      .assert.containsText(\"#s-result-info-bar .s-first-column span\",\n\
                           \"How to win friends and influence people\")\n\
      .waitForElementVisible(\".s-item-container img\", 2000)\n\
      .click(\".s-item-container img\")\n\
      .pause(1000)\n\
      .waitForElementVisible(\"#a-autoid-2-announce\", 2000)\n\
      .click(\"#a-autoid-2-announce\")\n\
      .pause(2000)\n\
      .waitForElementVisible(\"#buyButton\", 2000)\n\
      .click(\"#buyButton\")\n\
      .pause(2000)\n\
      .end();\n\
  }\n\
};");
  },
  'click #example-2': function () {
    Session.set('examplesPopUp', false);
    Router.go('app');
    codeMirror.setValue("module.exports = {\n\
  \'Search for awesome flight\': function (browser) {\n\
    var backspace = browser.Keys.BACK_SPACE;\n\
    var backspaceDate = [backspace, backspace, backspace, backspace,\n\
      backspace, backspace];\n\
    browser\n\
      .url(\'https://www.hipmunk.com/\')\n\
      .waitForElementVisible(\"body\", 1000)\n\
      .pause(1000)\n\
      .setValue(\"input[id=fac1flight]\", \"San Francisco\")\n\
      .setValue(\"input[id=fac2flight]\", \"Beijing\")\n\
      .pause(1000)\n\
      .waitForElementVisible(\"input[id=date0-flight]\", 1000)\n\
      .setValue(\"input[id=date0-flight]\", backspaceDate)\n\
      .setValue(\"input[id=date0-flight]\", \"Jun 9\")\n\
      .pause(1000)\n\
      .setValue(\"input[id=date1-flight]\", backspaceDate)\n\
      .waitForElementVisible(\"input[id=date1-flight]\", 1000)\n\
      .setValue(\"input[id=date1-flight]\", \"Jun 29\")\n\
      .pause(1000)\n\
      .click(\"button.frontbox-search-button\")\n\
      .end();\n\
  }\n\
};")
  },
  'click #example-3': function () {
    Session.set('examplesPopUp', false);
    Router.go('app');
    codeMirror.setValue("module.exports = {\n\
  \"Seafood search\": function (browser) {\n\
    browser\n\
      .url(\"http://www.yelp.com/\")\n\
      .waitForElementVisible(\"body\", 1000)\n\
      .assert.visible(\"input[name=find_desc]\")\n\
      .assert.visible(\"input[name=find_loc]\")\n\
      .setValue(\"input[name=find_desc]\", \"seafood\")\n\
      .waitForElementVisible(\"button[id=header-search-submit]\", 1000)\n\
      .click(\"button[id=header-search-submit]\")\n\
      .pause(3000)\n\
      .assert.containsText(\".container\", \"seafood\")\n\
      .end();\n\
  }\n\
};")
  }
});
