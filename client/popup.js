Template.popUp.events({
  'click #content-1 button': function () {
    document.getElementById("content-1").style.visibility="hidden";
    document.getElementById("content-2").style.display="block";
  },
  'click #content-2 button': function () {
    document.getElementById("sharePopup").style.display="none";
  }
});





