Run = new Mongo.Collection('run');
Test = new Mongo.Collection('test');
Recording = new Mongo.Collection('recording');

var imageStore = new FS.Store.GridFS('images');

Images = new FS.Collection('images', {
  stores: [imageStore],
  filter: {
    allow: {
      contentTypes: ['image/png']
    }
  }
});
