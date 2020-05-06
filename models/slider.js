
var c = require('mongoose');
var SliderSchema = new c.Schema({
  file: {type: String, required: true},
});
module.exports = c.model('Slider', SliderSchema);
