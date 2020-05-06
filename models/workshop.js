
var c = require('mongoose');
var WorkshopSchema = new c.Schema({
  title: {type: String, required: true},
  desc: {type: String, required: true},
  time: {type: Date, required: true},
  file: {type: String, required: true},
});
module.exports = c.model('Workshop', WorkshopSchema);
