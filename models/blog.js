
var c = require('mongoose');
var BlogSchema = new c.Schema({
  stu_id: String,
  desc: String,
  photo: {type: String, required: true},
  recep: String,
  date: Date,
  accept: String,
});
module.exports = c.model('Blog', BlogSchema);
