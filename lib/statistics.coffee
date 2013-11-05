events = require 'events'
util = require 'util'
_ = require 'underscore'
mongoose = require 'mongoose'
Collection = mongoose.Collection
class Statistics extends events.EventEmitter
  constructor : (@conn)->
    @excepts = []
    _.each 'connected disconnected error'.split(' '), (event) =>
      @conn.on event, (msg) =>
        @emit 'log', {
          category : 'event'
          method : event
          params : msg
          date : new Date()
        }
  # addExcept : (collectionNames) ->
  #   excepts = _.uniq @excepts.concat collectionNames
  #   @excepts = excepts.sort()
  # isExcept : (collection) ->
  #   ~_.indexOf @excepts, collection, true

  profiling : (funcs, conn) ->
    self = @
    fn = Collection.prototype
    funcs ?= _.functions fn
    _.each funcs, (funcName) ->
      tmp = fn[funcName]
      fn[funcName] = (args...) ->
        if @conn == conn
          collection = @name
          start = GLOBAL.process.hrtime()
          cbf = args.pop()
          tmpArgs = args
          args.push _.wrap cbf, (cb, args...) ->
            diff = GLOBAL.process.hrtime start
            elapsedTime = GLOBAL.parseFloat (diff[0] * 1e3 + diff[1] / 1e6).toFixed 2
            self.record {
              category : 'handle'
              method : funcName
              params : JSON.stringify tmpArgs
              date : new Date()
              collection : collection
              elapsedTime : elapsedTime
            }
            cb.apply null, args
          tmp.apply @, args
        else
          tmp.apply @, args
        fn["jt_#{funcName}"] ?= tmp
  record : (profiling) ->
    @emit 'profiling', profiling



module.exports = Statistics