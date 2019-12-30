const mongoose = require('mongoose');
const db = require('../models/index.model');

module.exports.postSignUp = async function (req, res, next) {
    const errors = [];

    const id = await db.accounts.find({ email: req.body.emailSignUp });

    if (id.length >= 1) {
        errors.push('email đã được sử dụng');
    } else {
        var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if(phone_regex.test(req.body.phoneNumber)===false){
            errors.push('Số điện thoại không hợp lệ!');
        }
        if (req.body.passwordSignUp !== req.body.repasswordSignUp) {
            errors.push('Mật khẩu nhập lại không đúng!');
        }
    }
    
    if (errors.length >= 1) {
        res.render('signup', {
            errors: errors,
            values: req.body,
        });
        return;
    } else {
        next();
    }
};

