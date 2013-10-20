(function() {
  var Client, Schema, Statistics, mongoose, requireTree, _,
    __slice = [].slice;

  _ = require('underscore');

  mongoose = require('mongoose');

  requireTree = require('require-tree');

  Statistics = require('./statistics');

  Schema = mongoose.Schema;

  Client = (function() {
    function Client(name, uri, options) {
      if (!options) {
        options = uri;
        uri = name;
      }
      this.conn = mongoose.createConnection(uri, options);
      this.schemas = {};
      this.statistics = new Statistics(this.conn);
    }

    Client.prototype.mongoose = mongoose;

    Client.prototype.set = function(key, value) {
      if (key === 'cacheRecords' && _.isNumber(value)) {
        return this.statistics.cacheRecords = GLOBAL.parseInt(value);
      }
    };

    Client.prototype.enableProfiling = function(funcs) {
      return this.statistics.profiling(funcs);
    };

    Client.prototype.getConnection = function(name) {
      return this.conn;
    };

    Client.prototype.on = function(event, cbf) {
      this.statistics.on(event, cbf);
      return this;
    };

    Client.prototype.initModels = function(path) {
      var models,
        _this = this;
      models = requireTree(path);
      _.each(models, function(model, name) {
        var schema;
        name = name.charAt(0).toUpperCase() + name.substring(1);
        schema = _this.schema(name, model.schema, model.options);
        if (model.indexes) {
          _.each(model.indexes, function(options) {
            return schema.index.apply(schema, options);
          });
        }
        return _this.model(name, schema);
      });
      return this;
    };

    Client.prototype.schema = function(name, obj, options) {
      if (obj) {
        this.schemas[name] = new Schema(obj, options);
      }
      return this.schemas[name];
    };

    Client.prototype.model = function() {
      var args, conn, name, schema;
      name = arguments[0], schema = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      conn = this.conn;
      if (!conn) {
        return null;
      } else if (!schema) {
        return conn.model(name);
      } else if (name) {
        if (!(schema instanceof Schema)) {
          schema = new Schema(schema);
        }
        this.schemas[name] = schema;
        args.unshift(name, schema);
        return conn.model.apply(conn, args);
      } else {
        return null;
      }
    };

    return Client;

  })();

  Client.prototype.Client = Client;

  module.exports = Client;

}).call(this);
