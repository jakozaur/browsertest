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

Router.route('/app/:testId', function () {
  this.render('browsertest');
}, {
  name: 'app.testId'
});

Router.route('/my-tests', function () {
  this.render('myTests');
}, {
  name: 'myTests'
});
