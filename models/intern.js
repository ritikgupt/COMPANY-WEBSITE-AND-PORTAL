var c=require("mongoose");
var InternSchema=new c.Schema({
    name:{type:String,required:true},
    college:{type:String,required:true},
    phone:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    branch:{type:String,required:true},
    course:{type:String,required:true},
    venue:{type:String,required:true},
    referal:{type:String,required:true},
    internship:{type:String,required:true},
})
module.exports=c.model("Intern",InternSchema)