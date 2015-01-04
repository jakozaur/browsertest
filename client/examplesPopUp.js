Template.examplesPopUp.helpers({
  show: function () {
    return Session.get('examplesPopUp');
  }
}); 

Template.examplesPopUp.events({
  'click .close-examples': function () {
    Session.set('examplesPopUp', false);
  },
  'click .overlay': function () {
    Session.set('examplesPopUp', false);
  },
  'click #example-1': function () {
    Session.set('examplesPopUp', false);
    Router.go('app');
    codeMirror.setValue('Hejka:)');
  }
}); 