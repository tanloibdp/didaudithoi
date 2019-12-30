const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nameTour: { type: String, required: true },
    vehicle: { type: String, required: true },
    dateStart: { type: String, required: true },
    _placeStart: { type: mongoose.Schema.Types.String, ref: 'PlaceStart', require: true },
    price: { type: Number, required: true },
    priceChildren: { type: Number, required: true },
    tickets: { type: Number, required: true },
    image: { type: String, required: true },
    image2: { type: String, required: true },
    image3: { type: String, required: true },
    image4: { type: String, required: true },
    image5: { type: String, required: true },
    status: { type: String, required: true },
    description: { type: String, require: true },
});

module.exports = mongoose.model('Tour', tourSchema, 'Tours');