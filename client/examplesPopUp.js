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
        .setValue(\"input[name=field-keywords]\", \"How to win friends and influence people\")\n\
        .click(\'input[type=submit]\')\n\
        .assert.elementPresent(\"#nav-cross-shop\")\n\
        .assert.elementPresent(\"#topDynamicContent\")\n\
        .assert.elementPresent(\"#leftNavContainer\")\n\
        .assert.containsText(\"#s-result-info-bar .s-first-column span\", \"How to win friends and influence people\")\n\
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
}");
  }
}); 








