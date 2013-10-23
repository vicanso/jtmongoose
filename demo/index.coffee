JTMongoose = require '../index'
_ = require 'underscore'
path = require 'path'
dbUri = 'mongodb://vicanso:test@localhost:10020/test'
options =
  db : 
    native_parser : true
  server :
    poolSize : 5
    socketOptions : 
      connectTimeoutMS : 500

client = new JTMongoose dbUri, options

client.on 'log', (log) ->
  console.dir log

client.on 'profiling', (records) ->
  console.dir records

client.initModels path.join __dirname, './models'
client.enableProfiling 'ensureIndex findAndModify findOne find insert save update getIndexes mapReduce'.split ' '

setInterval ->
  Book = client.model 'Book'
  Book.findOne {id : 1}, (err, doc) ->
    console.dir err
    console.dir doc
, 1000
