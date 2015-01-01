Template.myTests.helpers({
  tests: function () {
    if (Meteor.userId()) {
      return Test.find({userId: Meteor.userId()}).fetch();
    } else {
      return [];
    }
  }
});

Template.myTestsItem.events({
  'click .edit': function () {
    Router.go('app.testId', {testId: this._id})
  }
});
