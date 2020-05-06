
var c = require('mongoose');
var h = require('passport-local-mongoose');
var DetailSchema = new c.Schema({
  name: String,
  username: String,
  password: String,
  email: {type: String, unique: true, required: true},
  mobile: String,
  dept: String,
  type: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  file: String,
  college: String,
});
DetailSchema.plugin(h);
module.exports = c.model('Detail', DetailSchema);
