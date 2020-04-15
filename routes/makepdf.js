var a=require("express");
var b=require("body-parser");
var pdfMake=require('../pdfmake/pdfmake');
var vfsonts=require('../pdfmak/vfs_fonts');
pdfMake.vfs=vfsFonts.pdfMake.vfs;
var router=a.Router();



module.exports=router;