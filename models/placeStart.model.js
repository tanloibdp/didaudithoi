const mongoose = require('mongoose');

const placeStartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    placeStart: { type: String, required: true },
    description: { type: String, require: true },
});

module.exports = mongoose.model('PlaceStart', placeStartSchema);