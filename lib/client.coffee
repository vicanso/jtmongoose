_ = require 'underscore'
mongoose = require 'mongoose'
Collection = mongoose.Collection
Schema = mongoose.Schema
class Client
  constructor : ->
    @dbs = {}
    @schemas = {}
  db : (name) ->
    @dbs[name]
  on : (dbName, event, cbf) ->
    db = @db dbName
    if db
      db.on event, cbf
  init : (name, uri, options) ->
    if name && uri && !@dbs[name]
      @dbs[name] = mongoose.createConnection uri, options
    @
  schema : (dbName, name, obj, options) ->
    if obj
      @schemas["#{dbName}_#{name}"] = new Schema obj, options
    @schemas["#{dbName}_#{name}"]
  model : (dbName, name, schema, args...) ->
    db = @db dbName
    if !db
      null
    else if !schema
      db.model name
    else if name
      schema = new Schema schema if !(schema instanceof Schema)
      @schemas["#{dbName}_#{name}"] = schema
      args.unshift name, schema
      db.model.apply db, args
    else
      null

# _.each 'ensureIndex findAndModify findOne find insert save update getIndexes mapReduce'.split(' '), (func) ->
#   tmp = Collection.prototype[func]
#   Collection.prototype[func] = (args...) ->
#     console.dir func
#     console.dir args
#     tmp.apply @, args

Client::Client = Client
module.exports = Client