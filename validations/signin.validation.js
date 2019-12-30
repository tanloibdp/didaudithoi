const db = require('../models/index.model');
const bcrypt = require('bcrypt');

module.exports.postSignIn = function (req, res, next) {
    const errors = [];

    db.accounts.find({ email: req.body.emailSignIn })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                bcrypt.compare(req.body.passwordSignIn, user[0].password, function (err, result) {
                    // res == true
                    if (err) {
                        return res.status(500).json({
                            Error: err
                        });
                    }
                    if (result) {
                        res.cookie('accountId', user[0]._id, { signed: true });
                        req.body.role = user[0].role;
                        next();
                    } else {
                        errors.push('Mật khẩu của bạn sai')
                        res.render('signin', {
                            errors: errors,
                            values: req.body,
                        });
                        return;
                    }
                });
            } else {
                errors.push('Tài khoản chưa được đăng ký')
                res.render('signin', {
                    errors: errors,
                    values: req.body,
                })
                return;
            }

        }).catch(err => {
            return res.status(500).json({
                Error: err
            });
        });
}

//hàm kiểm tra cookie đã đăng nhập chưa
module.exports.getCookie = async function (req, res, next) {
    if (!req.signedCookies.accountId) {
        res.redirect('/signin');
        return;
    }

    const _id = await db.accounts.findById(req.signedCookies.accountId);

    switch (_id.role) {
        case 5:
            res.redirect('/signin/confirm');
            return;
        default:
            break;
    }

    req.body.user = _id;
    next();
}

module.exports.getCookieRole = async function (req, res, next) {
    if (!req.signedCookies.accountId) {
        res.redirect('/signin');
        return;
    }

    const _id = await db.accounts.findById(req.signedCookies.accountId);

    switch (_id.role) {
        case 1:
            res.redirect('/admin');
            return;
        case 3:
            res.redirect('/');
            return;
        default:
            break;
    }

    req.body.user = _id;
    next();
}