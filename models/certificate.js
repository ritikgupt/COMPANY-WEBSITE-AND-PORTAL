
var c = require('mongoose');
var CertificateSchema = new c.Schema({
  file: {type: String, required: true},
  stu_id: {type: String, required: true},
});
module.exports = c.model('Certificate', CertificateSchema);
