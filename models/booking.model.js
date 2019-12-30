const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', require: true },
    _customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerInfo', require: true },
    Ntickets: { type: Number, require: true },
    price: { type: Number, required: true },
    NCtickets: { type: Number, require: true },
    priceChildren: { type: Number, required: true },
    dateBook: { type: Date, require: true },
    status: { type: String, require: true }
});

module.exports = mongoose.model('BookTour', bookSchema);