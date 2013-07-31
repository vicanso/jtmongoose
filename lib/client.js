(function() {
  var Client, Collection, Schema, mongoose, _,
    __slice = [].slice;

  _ = require('underscore');

  mongoose = require('mongoose');

  Collection = mongoose.Collection;

  Schema = mongoose.Schema;

  Client = (function() {

    function Client() {
      this.dbs = {};
      this.schemas = {};
    }

    Client.prototype.db = function(name) {
      return this.dbs[name];
    };

    Client.prototype.on = function(dbName, event, cbf) {
      var db;
      db = this.db(dbName);
      if (db) {
        return db.on(event, cbf);
      }
    };

    Client.prototype.init = function(name, uri, options) {
      if (name && uri && !this.dbs[name]) {
        this.dbs[name] = mongoose.createConnection(uri, options);
      }
      return this;
    };

    Client.prototype.schema = function(dbName, name, obj, options) {
      if (obj) {
        this.schemas["" + dbName + "_" + name] = new Schema(obj, options);
      }
      return this.schemas["" + dbName + "_" + name];
    };

    Client.prototype.model = function() {
      var args, db, dbName, name, schema;
      dbName = arguments[0], name = arguments[1], schema = arguments[2], args = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
      db = this.db(dbName);
      if (!db) {
        return null;
      } else if (!schema) {
        return db.model(name);
      } else if (name) {
        if (!(schema instanceof Schema)) {
          schema = new Schema(schema);
        }
        this.schemas["" + dbName + "_" + name] = schema;
        args.unshift(name, schema);
        return db.model.apply(db, args);
      } else {
        return null;
      }
    };

    return Client;

  })();

  Client.prototype.Client = Client;

  module.exports = Client;

}).call(this);
