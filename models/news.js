var c=require("mongoose");
var NewsSchema=new c.Schema({
    title:{type:String,required:true},
    desc:{type:String,required:true},
    time:{type:Date,required:true},
    file:{type:String,required:true}
})
module.exports=c.model("News",NewsSchema)