const mongoose = require('mongoose');
const db = require('../models/index.model');
const bcrypt = require('bcrypt');

module.exports.get = function (req, res, next) {
    res.render('signup');
};

module.exports.post = function (req, res, next) {
    bcrypt.hash(req.body.passwordSignUp, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                Error: err
            });
        } else {
            const newAccount = new db.accounts({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.emailSignUp,
                password: hash,
                role: 5,
                avatar: '/avatars/avt.png',
            });
            newAccount.save();
            const customerInfo = new db.customerInfor({
                _id: new mongoose.Types.ObjectId(),
                _accountId: newAccount._id,
                displayname: req.body.displayname,
                gender: '',
                birthday: '',
                numberPhone: req.body.phoneNumber,
                address: '',
            });
            customerInfo.save();
        }
    });
    res.redirect('/signin');
}