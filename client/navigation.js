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

Template.navigation.events({
  'click #login-name-link': function (event, tmpl) {
    if (Session.get('logoutDropdownVisible')) {
      Accounts._loginButtonsSession.closeDropdown();
      Session.set('logoutDropdownVisible', false);
    } else {
      Session.set('logoutDropdownVisible', true);
    }
  },
  'click #login-sign-in-link': function (event, tmpl) {
    Accounts._loginButtonsSession.closeDropdown();
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
