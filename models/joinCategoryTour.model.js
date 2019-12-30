const mongoose = require('mongoose');

const joinCategoryTourSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _categoryId: { type: mongoose.Schema.Types.String, ref: 'CategoryTour', require: true },
    _tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', require: true },
    description: { type: String, require: true },
});

module.exports = mongoose.model('JoinCategoryTourSchema', joinCategoryTourSchema);