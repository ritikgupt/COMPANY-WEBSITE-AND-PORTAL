var c=require("mongoose");
var h = require("passport-local-mongoose");
var StaffSchema=new c.Schema({
    name:String,
    emp_id:String,
    password:String,
    email:String,
    mobile:String,
    dept:String
    
})
StaffSchema.plugin(h)
module.exports=c.model("Staff",StaffSchema)