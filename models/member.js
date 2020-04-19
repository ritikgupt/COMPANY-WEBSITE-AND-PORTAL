var c=require("mongoose");
var MemberSchema=new c.Schema({
    file:{type:String,required:true},
    designation:{type:String,required:true},
    linkedIn:{type:String,required:true},
    name:{type:String,required:true}
})
module.exports=c.model("Member",MemberSchema)