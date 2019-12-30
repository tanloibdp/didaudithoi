var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = require('../models/index.model');

/* GET home page. */
router.get('/', async function (req, res, next) {
  var danhmucPT = ['Vietjet', 'Air Asia', 'Jetstar'];
  var danhmucPrice = ['dưới 2 triệu', 'dưới 4 triệu', 'dưới 6 triệu', 'dưới 8 triệu'];

  //Lấy random doccument
  var docs = await db.tours.aggregate([{ $sample: { size: 6 } }]);

  var placeStart = await db.placeStart.find();
  const doccument = {
    title: 'Express',
    placeStart: placeStart,
    _placeStart: '',
    danhmucPT: danhmucPT,
    _indexDanhmuc: req.query.vehicle,
    danhmucPrice: danhmucPrice,
    _indexPrice: '',
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
  res.render('index', doccument);
});

module.exports = router;
