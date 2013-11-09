(function() {
  var Collection, Statistics, events, mongoose, util, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  events = require('events');

  util = require('util');

  _ = require('underscore');

  mongoose = require('mongoose');

  Collection = mongoose.Collection;

  Statistics = (function(_super) {
    __extends(Statistics, _super);

    function Statistics(conn) {
      var _this = this;
      this.conn = conn;
      this.excepts = [];
      _.each('connected disconnected error'.split(' '), function(event) {
        return _this.conn.on(event, function(msg) {
          return _this.emit('log', {
            category: 'event',
            method: event,
            params: msg,
            date: new Date()
          });
        });
      });
    }

    Statistics.prototype.profiling = function(funcs, conn) {
      var fn, self;
      self = this;
      fn = Collection.prototype;
      if (funcs == null) {
        funcs = _.functions(fn);
      }
      return _.each(funcs, function(funcName) {
        var tmp;
        tmp = fn[funcName];
        return fn[funcName] = function() {
          var args, cbf, collection, start, tmpArgs, _name;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (this.conn === conn) {
            collection = this.name;
            start = GLOBAL.process.hrtime();
            cbf = args.pop();
            tmpArgs = args;
            args.push(_.wrap(cbf, function() {
              var args, cb, diff, elapsedTime;
              cb = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
              diff = GLOBAL.process.hrtime(start);
              elapsedTime = GLOBAL.parseFloat((diff[0] * 1e3 + diff[1] / 1e6).toFixed(2));
              self.record({
                category: 'handle',
                method: funcName,
                params: JSON.stringify(tmpArgs),
                date: new Date,
                collection: collection,
                elapsedTime: elapsedTime
              });
              return cb.apply(null, args);
            }));
            tmp.apply(this, args);
          } else {
            tmp.apply(this, args);
          }
          return fn[_name = "jt_" + funcName] != null ? fn[_name = "jt_" + funcName] : fn[_name] = tmp;
        };
      });
    };

    Statistics.prototype.record = function(profiling) {
      return this.emit('profiling', profiling);
    };

    return Statistics;

  })(events.EventEmitter);

  module.exports = Statistics;

}).call(this);
