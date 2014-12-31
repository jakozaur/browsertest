Template.navigation.helpers({
  menuItems: function () {
    return [{route: 'app', name: "Test console"},
      {route: 'mytests', name: "My tests"},
      {route: 'logout', name: "Logout"}];
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