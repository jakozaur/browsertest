Template.myTests.helpers({
  tests: function () {
    if (Meteor.userId()) {
      return Test.find({userId: Meteor.userId()}).fetch();
    } else {
      return [];
    }
  }
});

Template.myTests.events({
  'click .edit': function (event, tmpl) {
    var testId = tmpl.$('input[type=radio]:checked').attr('id');
    if (testId) {
      Router.go('app.testId', {testId: testId});
    }
  },
  'click .delete': function (event, tmpl) {
    var testId = tmpl.$('input[type=radio]:checked').attr('id');
    if (testId) {
      Test.remove(testId); 
    }
  },
  'click .run': function (event, tmpl) {
    var testId = tmpl.$('input[type=radio]:checked').attr('id');
    if (testId) {
      Router.go('app.testId', {testId: testId});
      var code = Test.findOne(testId).code;
      Meteor.call('runCode', code, function (error, runId) {
        Session.set('runId', runId);
      });
    }
  }
});

Template.myTestsItem.events({
  'click .edit': function () {
    Router.go('app.testId', {testId: this._id})
  }
});


