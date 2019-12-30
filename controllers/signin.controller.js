const nodemailer = require('nodemailer');
const environment = require('../environments');
const db = require('../models/index.model');

module.exports.get = function (req, res, next) {
    res.render('signin');
};

module.exports.post = function (req, res, next) {
    switch (req.body.role) {
        case 1:
            res.redirect('/admin');
            break;
        case 3:
            res.redirect('/');
            break;
        case 5:
            res.redirect('/signin/confirm');
            break;
        default:
            break;
    }
};

module.exports.getlogout = async function (req, res, next) {
    if (req.signedCookies.accountId) {
        const _id = await db.accounts.findById(req.signedCookies.accountId);
        if (_id.role === 3) {
            res.clearCookie("accountId");
            res.redirect('/');
            return;
        }
    }
    res.clearCookie("accountId");
    res.redirect('/signin');
};

module.exports.confirm = function (req, res, next) {
    // const info = await db.customerInfo.find({ _accountId: req.body.user._id });

    //Step 1:
    let transporter = nodemailer.createTransport({
        service: environment.serviceMail,
        auth: {
            user: environment.adminUser,
            pass: environment.adminPassword
        }
    });

    //Step 2:
    let mailOptions = {
        from: environment.adminUser,
        to: req.body.user.email,
        subject: 'DIDAUDITHOI.COM MÃ XÁC NHẬN ' + Date.now(),
        text: `Chào bạn, \nMời bạn vào đường link để bạn kích hoạt tài khoản của bạn: http://localhost:3000/signin/${req.body.user._id}`,

    };

    //Step 3: 
    transporter.sendMail(mailOptions, function () {
        if (err) {
            console.log('Lỗi trong lúc gửi mã!');
        } else {
            console.log('Email đã được gửi!');
        }
    });

    res.send('<p>bạn cần vào mail để xác nhận kích hoạt tài khoản<p>')
};

module.exports.confirmId = function (req, res, next) {
    const check = req.params.id;
    if (check.includes(req.body.user._id)) {
        req.body.user.role = 3;
        db.accounts.update({ _id: req.body.user._id }, { $set: req.body.user })
            .exec()
            .then(result => {
                res.redirect('/');
            })
            .catch(err => {
                res.status(200).json({
                    Error: err
                });
            });
    }
};