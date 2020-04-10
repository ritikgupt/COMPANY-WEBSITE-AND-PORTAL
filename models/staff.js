var c=require("mongoose");
var StaffSchema=new c.Schema({
    name:String,
    emp_id:String,
    password:String,
    email:String,
    mobile:String,
    dept:String
    
})
module.exports=c.model("Staff",StaffSchema)