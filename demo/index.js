(function() {
  var Book, Client, Collection, Schema, book, bookSchema, jtMongoose, mongoose, options, profileModel, profileSchema, _;

  _ = require('underscore');

  mongoose = require('mongoose');

  Collection = mongoose.Collection;

  Schema = mongoose.Schema;

  Client = require('../lib/client');

  jtMongoose = new Client;

  options = {
    db: {
      native_parser: false
    },
    server: {
      poolSize: 5
    }
  };

  jtMongoose.init('test', 'mongodb://localhost:10020/test', options);

  jtMongoose.on('test', 'connected', function(err, data) {
    var book;
    console.dir('connected');
    book = new Book({
      id: 1110,
      name: 'adfe',
      author: 'vicanso'
    });
    return book.save();
  });

  jtMongoose.on('test', 'disconnected', function(err, data) {
    return console.dir('disconnected');
  });

  bookSchema = jtMongoose.schema('test', 'Mark', {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    price: Number,
    createdAt: {
      type: Date,
      "default": Date.now
    },
    info: {
      production: String
    }
  });

  jtMongoose.db('test').setProfiling('all', 1, function(err, query, items) {});

  bookSchema.methods.findSameAuthor = function(cbf) {
    return this.model('Mark').find({
      author: this.author
    }, cbf);
  };

  bookSchema.statics.findByAuthor = function(author, cbf) {
    return this.find({
      author: author
    }, cbf);
  };

  Book = jtMongoose.model('test', 'Mark', bookSchema);

  profileSchema = jtMongoose.schema('test', 'system.profile', {}, false);

  profileModel = jtMongoose.model('test', 'system.profile', profileSchema);

  book = new Book({
    id: '123',
    name: 'test',
    price: '1.23'
  });

  console.dir(book.toJSON());

}).call(this);
