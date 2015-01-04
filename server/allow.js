var noEditsOnClient = {
  insert: function () {
    return false;
  },
  update: function () {
    return false;
  },
  remove: function () {
    return false;
  }
};

Run.allow(noEditsOnClient);
Recording.allow(noEditsOnClient);

var onlyOwnerCanChange = {
  insert: function (userId, doc) {
    return userId && userId === doc.userId;
  },
  update: function (userId, doc, fields) {
    return userId === doc.userId && !_.contains('fields', 'userId');
  },
  remove: function (userId, doc) {
    return userId === doc.userId
  },
  fetch: ['userId']
}

Test.allow(onlyOwnerCanChange);
