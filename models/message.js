var c=require("mongoose");
var MessageSchema=new c.Schema({
    desc:String,
    recep:String,
    date:Date,
})
module.exports=c.model("Message",MessageSchema)