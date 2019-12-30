var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = require('../models/index.model');

/* GET home page. */
router.get('/', async function (req, res, next) {
    var danhmucPT = ['Vietjet', 'Air Asia', 'Jetstar'];
    var danhmucPrice = ['dưới 2 triệu', 'dưới 4 triệu', 'dưới 6 triệu', 'dưới 8 triệu'];
    var docs = await db.tours.find();
    var placeStart = await db.placeStart.find();
    const _placeStart = req.query.placeStart ? req.query.placeStart === 'Điểm khởi hành' ? "" : req.query.placeStart : "";
    var vehicle = '';
    var price = 9999999999;
    if (req.query.dateStart) {
        const _dt = new Date(req.query.dateStart);
        const formatD = [_dt.getDate(), (_dt.getMonth() + 1), _dt.getFullYear()].join('/');
        docs = docs.filter(item => {
            return item.dateStart === formatD;
        });
    }
    switch (req.query.vehicle) {
        case '0':
            vehicle = 'Vietjet';
            break;
        case '1':
            vehicle = 'Air Asia';
            break;
        case '2':
            vehicle = 'Jetstar';
            break;

        default:
            break;
    }
    switch (req.query.price) {
        case '0':
            price = 2000000;
            break;
        case '1':
            price = 4000000;
            break;
        case '2':
            price = 6000000;
            break;
        case '3':
            price = 8000000;
            break;
        default:
            break;
    }
    docs = docs.filter(item => {
        return String(item._placeStart).indexOf(_placeStart) !== -1;
    })
    docs = docs.filter(item => {
        return item.vehicle.toLowerCase().indexOf(vehicle.toLowerCase()) !== -1;
    });
    docs = docs.filter(item => {
        return Number(item.price) <= Number(price);
    });



    const doccument = {
        title: 'Trang tìm kiếm',
        placeStart: placeStart,
        _placeStart: _placeStart,
        danhmucPT: danhmucPT,
        _indexDanhmuc: req.query.vehicle,
        danhmucPrice: danhmucPrice,
        _indexPrice: req.query.price,
        docs: docs.map(doc => {
            return {
                _id: doc._id,
                nameTour: doc.nameTour,
                vehicle: doc.vehicle,
                price: doc.price,
                image: doc.image,
            }
        }),
    }
    res.render('searchPage', doccument);
});

module.exports = router;
