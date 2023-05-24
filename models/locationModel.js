var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var locationSchema = new Schema({
	'number' : Number,
	'name' : String,
	'address' : String,
	'latitude' : Number,
	'longitude' : Number,
	'capacity' : Number,
	'bikes' : Number,
	'stands' : Number
});

module.exports = mongoose.model('location', locationSchema);
