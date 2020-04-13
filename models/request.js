var c=require("mongoose");
var RequestSchema=new c.Schema({
    stu_id:String,
    desc:String,
    req_file:String,
    recep:String,
    date:Date,
})
module.exports=c.model("Request",RequestSchema)