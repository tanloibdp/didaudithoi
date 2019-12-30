const mongoose = require('mongoose');

const categoryTourSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    catagory: { type: Number, require: true },
    zone: { type: String, require: true }
});

module.exports = mongoose.model('CategoryTour', categoryTourSchema);