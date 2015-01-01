Template.navigation.helpers({
  menuItems: function () {
    if (Meteor.userId()) {
      return [{route: 'app', name: "Test console"},
        {route: 'mytests', name: "My tests"}];
    } else {
      return [];
    }
  }
});

Template.navigationMenuItem.helpers({
  cssClass: function () {
    if (Router.current() && Router.current().route.getName() === this.route) {
      return 'active';
    } else {
      return '';
    }
  }
});
