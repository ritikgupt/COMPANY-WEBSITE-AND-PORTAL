
var c = require('mongoose');
var ProgramSchema = new c.Schema({
  about: {type: String, required: true},
  eligibility: {type: String, required: true},
  certificate: {type: String, required: true},
  fee: {type: String, unique: true, required: true},
  type: {type: String, required: true},
});
module.exports = c.model('Program', ProgramSchema);
