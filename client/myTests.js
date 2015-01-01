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
    Session.set('testId', this._id);
    Router.go('app');
  }
});
