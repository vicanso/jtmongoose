_ = require 'underscore'
mongoose = require 'mongoose'
requireTree = require 'require-tree'
Statistics = require './statistics'

Schema = mongoose.Schema
class Client
  constructor : (name, uri, options) ->
    if !options
      options = uri
      uri = name

    @conn = mongoose.createConnection uri, options
    @schemas = {}
    @statistics = new Statistics @conn
  mongoose : mongoose
  set : (key, value) ->
  enableProfiling : (funcs) ->
    @statistics.profiling funcs, @conn
  # profilingExcept : (collectionNames) ->
  #   if collectionNames
  #     collectionNames = [collectionNames] if !_.isArray collectionNames
  #     @statistics.addExcept collectionNames
  getConnection : (name) ->
    @conn
  on : (event, cbf) ->
    @statistics.on event, cbf
    @
  initModels : (path) ->
    models = requireTree path
    _.each models, (model, name) =>
      name = name.charAt(0).toUpperCase() + name.substring 1
      schema = @schema name, model.schema, model.options
      if model.indexes
        _.each model.indexes, (options) ->
          schema.index.apply schema, options
      @model name, schema
    @
  schema : (name, obj, options) ->
    if obj
      @schemas[name] = new Schema obj, options
    @schemas[name]
  model : (name, schema, args...) ->
    conn = @conn
    if !conn
      null
    else if !schema
      conn.model name
    else if name
      schema = new Schema schema if !(schema instanceof Schema)
      @schemas[name] = schema
      args.unshift name, schema
      conn.model.apply conn, args
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