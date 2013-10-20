(function() {
  var JTMongoose, client, dbUri, options, path, _;

  JTMongoose = require('../index');

  _ = require('underscore');

  path = require('path');

  dbUri = 'mongodb://vicanso:test@localhost:10020/test';

  options = {
    db: {
      native_parser: true
    },
    server: {
      poolSize: 5,
      socketOptions: {
        connectTimeoutMS: 500
      }
    }
  };

  client = new JTMongoose(dbUri, options);

  client.on('log', function(log) {
    return console.dir(log);
  });

  client.on('profiling', function(records) {
    return console.dir(records);
  });

  client.initModels(path.join(__dirname, './models'));

  client.enableProfiling('ensureIndex findAndModify findOne find insert save update getIndexes mapReduce'.split(' '));

  setInterval(function() {
    var Book;
    Book = client.model('Book');
    return Book.findOne({
      id: 1
    }, function(err, doc) {
      console.dir(err);
      return console.dir(doc);
    });
  }, 1000);

}).call(this);
