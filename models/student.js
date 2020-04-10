var c=require("mongoose");
var h = require("passport-local-mongoose");
var StudentSchema=new c.Schema({
    name:String,
   username:String,
    password:String,
    email:{type:String,unique:true,required:true},
    mobile:String,
    branch:String,
    resetPasswordToken:String,
    resetPasswordExpires:Date,

})
StudentSchema.plugin(h)
module.exports=c.model("Student",StudentSchema)