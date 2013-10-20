
module.exports =
  schema :
    id : 
      type : Number
      require : true
      index : true 
    author : 
      type : String
      require : true
    name : 
      type : String
      require : true
  indexes : [
    [
      {
        author : 1
        name : 1
      }
    ]
  ]