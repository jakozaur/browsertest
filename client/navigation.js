Template.navigation.helpers({
  menuItems: function () {
    if (Meteor.userId()) {
      return [
        {route: 'app', name: "Test console", alternativeRoutes: ['app.testId']},
        {route: 'myTests', name: "My tests"}];
    } else {
      return [];
    }
  }
});

Template.navigationMenuItem.helpers({
  cssClass: function () {
    var name = Router.current() && Router.current().route.getName();
    if (name === this.route ||
        _.indexOf(this.alternativeRoutes || [], name) !== -1) {
      return 'active';
    } else {
      return '';
    }
  }
});
