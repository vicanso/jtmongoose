events = require 'events'
util = require 'util'
_ = require 'underscore'
mongoose = require 'mongoose'
Collection = mongoose.Collection
class Statistics extends events.EventEmitter
  constructor : (@conn)->
    @cacheRecords = 100
    @profilingRecords = []
    _.each 'connected disconnected error'.split(' '), (event) =>
      @conn.on event, (msg) =>
        @emit 'log', {
          category : 'event'
          method : event
          param : msg
          date : new Date()
        }
  profiling : (funcs) ->
    self = @
    fn = Collection.prototype
    _.each funcs, (funcName) ->
      if !fn["jt_#{funcName}"]
        tmp = fn[funcName]
        fn[funcName] = (args...) ->
          start = Date.now()
          cbf = args.pop()
          se = JSON.stringify args
          args.push _.wrap cbf, (cb, args...) ->
            self.record {
              category : 'handle'
              method : funcName
              param : se
              date : new Date()
              elapsedTime : Date.now() - start
            }
            cb.apply null, args
          tmp.apply @, args
        fn["jt_#{funcName}"] = tmp
  record : (profiling) ->
    profilingRecords = @profilingRecords
    profilingRecords.push profiling
    if profilingRecords.length == @cacheRecords
      @emit 'profiling', profilingRecords
      @profilingRecords = []



module.exports = Statistics