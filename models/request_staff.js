var c=require("mongoose");
var Request_staffSchema=new c.Schema({
    empid:String,
    desc:String,
    recep:String,
    credit:String,
    purpose:String,
    date:Date,
})
module.exports=c.model("Request_staff",Request_staffSchema)