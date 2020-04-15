var c=require("mongoose");
var Request_staffSchema=new c.Schema({
    stu_id:String,
    desc:String,
    req_file:{type:String,required:true},
    recep:String,
    date:Date,
})
module.exports=c.model("Request_staff",Request_staffSchema)