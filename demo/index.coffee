_ = require 'underscore'
mongoose = require 'mongoose'
Collection = mongoose.Collection
Schema = mongoose.Schema
Client = require '../lib/client'
jtMongoose = new Client
options =
	db : 
		native_parser : false
	server :
		poolSize : 5
jtMongoose.init 'test', 'mongodb://localhost:10020/test', options

jtMongoose.on 'test', 'connected', (err, data) ->
	console.dir 'connected'
	book = new Book {
		id : 1110
		name : 'adfe'
		author : 'vicanso'
	}
	book.save()
jtMongoose.on 'test', 'disconnected', (err, data) ->
	console.dir 'disconnected'

bookSchema = jtMongoose.schema 'test', 'Mark', {
	id : 
		type : Number
		required : true
	name : 
		type : String
		required : true
	author : 
		type : String
		required : true
	price : Number
	createdAt :
		type : Date
		default : Date.now
	info :
		production : String
}

jtMongoose.db('test').setProfiling 'all', 1, (err, query, items) ->
	# console.dir err
	# console.dir query

# Connection#setProfiling(level, [ms], callback)
bookSchema.methods.findSameAuthor = (cbf) ->
	@model('Mark').find {author : @author}, cbf
bookSchema.statics.findByAuthor = (author, cbf) ->
	this.find {author : author}, cbf

Book = jtMongoose.model 'test', 'Mark', bookSchema

# console.time 'log'

# Book.findOneAndUpdate {id : 122}, {author : 'test'}, (err, doc) ->
# 	console.timeEnd 'log'

# Book.find {}, (err, docs) ->
# 	console.dir docs.addToSet


# Book.findByAuthor 'vicanso', (err, docs) ->
# 	console.dir docs


# book.findSameAuthor (err, docs) ->
# 	console.dir docs

	# console.dir docs

# var animalSchema = new Schema({ name: String, type: String });

# animalSchema.methods.findSimilarTypes = function (cb) {
#   return this.model('Animal').find({ type: this.type }, cb);
# }
# Now all of our animal instances have a findSimilarTypes method available to it.

# var Animal = mongoose.model('Animal', animalSchema);
# var dog = new Animal({ type: 'dog' });

# dog.findSimilarTypes(function (err, dogs) {
#   console.log(dogs); // woof
# });