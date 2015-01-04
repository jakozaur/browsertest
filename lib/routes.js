Router.route('/', function () {
  this.render('home');
}, {
  name: 'home'
});

Router.route('/app', function () {
  this.render('browsertest');
}, {
  name: 'app'
});

Router.route('/app/recording/:recordingId', function () {
  this.render('browsertest');
}, {
  name: 'app.recordingId'
});

Router.route('/app/test/:testId', function () {
  this.render('browsertest');
}, {
  name: 'app.testId'
});

Router.route('/my-tests', function () {
  this.render('myTests');
}, {
  name: 'myTests'
});

Router.route('/test/record/:testId', function () {
  var self = this;
  var testId = self.params.testId;

  if (self.request.method === 'POST') {
    var data = '';
    self.request.on('data', function(chunk) {
      data += chunk;
    });
    self.request.on('end', Meteor.bindEnvironment(function () {
      var events = JSON.parse(data);

      Recording.update(testId, {$push:
        {events: { $each: events } }
      });
      self.response.end('OK\n');
    }));
  } else {
    self.response.statusCode = 405;
    self.response.end('Support only post\n');
  }

}, {where: 'server'});
