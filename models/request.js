
var c = require('mongoose');
var RequestSchema = new c.Schema({
  stu_id: String,
  desc: String,
  req_file: {type: String, required: true},
  recep: String,
  date: Date,
  accept: String,
});
module.exports = c.model('Request', RequestSchema);
