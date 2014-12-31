Meteor.startup(function () {
  console.log("Startup");
  var httpMaster = new WebSockifyServer(function (url) {
    return {host: Meteor.settings.docker.host, port: 5555};
  });
})
