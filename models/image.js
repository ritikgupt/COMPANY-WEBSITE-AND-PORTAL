var c=require("mongoose");
var ImageSchema=new c.Schema({
    file:{type:String,required:true}
})
module.exports=c.model("Image",ImageSchema)