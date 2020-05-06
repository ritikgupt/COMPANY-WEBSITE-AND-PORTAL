
var c = require('mongoose');
var SponsorSchema = new c.Schema({
  file: {type: String, required: true},
});
module.exports = c.model('Sponsor', SponsorSchema);
