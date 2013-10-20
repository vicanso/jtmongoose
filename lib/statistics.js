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
      this.cacheRecords = 100;
      this.profilingRecords = [];
      _.each('connected disconnected error'.split(' '), function(event) {
        return _this.conn.on(event, function(msg) {
          return _this.emit('log', {
            category: 'event',
            method: event,
            param: msg,
            date: new Date()
          });
        });
      });
    }

    Statistics.prototype.profiling = function(funcs) {
      var fn, self;
      self = this;
      fn = Collection.prototype;
      return _.each(funcs, function(funcName) {
        var tmp;
        if (!fn["jt_" + funcName]) {
          tmp = fn[funcName];
          fn[funcName] = function() {
            var args, cbf, se, start;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            start = Date.now();
            cbf = args.pop();
            se = JSON.stringify(args);
            args.push(_.wrap(cbf, function() {
              var args, cb;
              cb = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
              self.record({
                category: 'handle',
                method: funcName,
                param: se,
                date: new Date(),
                elapsedTime: Date.now() - start
              });
              return cb.apply(null, args);
            }));
            return tmp.apply(this, args);
          };
          return fn["jt_" + funcName] = tmp;
        }
      });
    };

    Statistics.prototype.record = function(profiling) {
      var profilingRecords;
      profilingRecords = this.profilingRecords;
      profilingRecords.push(profiling);
      if (profilingRecords.length === this.cacheRecords) {
        this.emit('profiling', profilingRecords);
        return this.profilingRecords = [];
      }
    };

    return Statistics;

  })(events.EventEmitter);

  module.exports = Statistics;

}).call(this);
