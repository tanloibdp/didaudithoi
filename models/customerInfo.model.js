const mongoose = require('mongoose');

const customerInfoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', require: true },
    displayname: { type: String, require: true },
    gender: { type: String, require: true },
    birthday: { type: String, require: true },
    numberPhone: { type: String, require: true, match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im },
    address: { type: String, require: true },
});

module.exports = mongoose.model('CustomerInfo', customerInfoSchema);