
var c = require('mongoose');
var h = require('passport-local-mongoose');
var StaffSchema = new c.Schema({
  name: String,
  username: String,
  password: String,
  email: {type: String, unique: true, required: true},
  mobile: String,
  dept: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
StaffSchema.plugin(h);
module.exports = c.model('Staff', StaffSchema);
