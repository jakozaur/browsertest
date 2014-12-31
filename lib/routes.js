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

Router.route('/my-tests', function () {
  this.render('mytests');
}, {
  name: 'mytests'
});

Router.route('/logout', function () {
  this.render('home'); // TODO: ...
}, {
  name: 'logout'
});