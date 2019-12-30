var express = require('express');

const route = express.Router();
const db = require('../models/index.model');

route.get('/:customerId', async function (req, res, next) {
    const customerInfor = await db.customerInfor.findById(req.params.customerId).populate('_accountId');
    const doccument = {
        title: 'Thông tin cá nhân',
        customerInfor: {
            displayname: customerInfor.displayname,
            address: customerInfor.address === '' ? 'Đang cập nhật' : customerInfor.address,
            email: customerInfor._accountId.email,
            numberPhone: customerInfor.numberPhone,
        },
    };
    res.render('customerDetail', doccument);
});


module.exports = route;