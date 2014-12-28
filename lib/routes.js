Router.route('/', function () {
  this.render('home');
});

Router.route('/app', function () {
  this.render('browsertest');
});

Router.route('/my-tests', function () {
  this.render('mytests');
})