var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = require('../models/index.model');


/* GET Tour page. */
router.get('/', async function (req, res, next) {
  var tours = await db.tours.find();
  const doccument = {
    title: 'Danh sách tours',
    docs: tours.map(doc => {
      return {
        _id: doc._id,
        nameTour: doc.nameTour,
        price: doc.price,
        image: doc.image,
      }
    }),
  }
  res.render('tourInCountry', doccument);
});

/* GET booked page. */
router.get('/booked', function (req, res, next) {
  if (!res.locals.userSession) {
    res.redirect('/signin');
    return;
  };
  next();
}, async function (req, res, next) {
  const booked = await db.booking.find({ _customerId: res.locals.userSession._id }).populate('_tourId').sort({dateBook: 'descending'});

  function DateFormat(params) {
    var Re = `${params.getDate()}/${params.getMonth()+1}/${params.getFullYear()} ${params.getHours()}:${params.getMinutes()}:${params.getSeconds()} `
    return Re;
  }

  const doccument = {
    booked: booked.map(doc => {
      return {
        image: doc._tourId.image,
        Ntickets: doc.Ntickets,
        price: doc.price,
        NCtickets: doc.NCtickets,
        priceChildren: doc.priceChildren,
        dateBook: DateFormat(doc.dateBook),
        status: doc.status,
        sumPrice: Number((doc.Ntickets * doc.price) + (doc.NCtickets * doc.priceChildren)),
      };
    }),
    title: 'Express'
  };
  res.render('booked', doccument);
});


/* GET Tour Detail page. */
router.get('/:tourId', async function (req, res, next) {
  var doc = await db.tours.findById(req.params.tourId);
  res.render('productDetail', { title: 'Express', doc: doc });
});

/* GET Pay for Tour Detail page. */
router.get('/pay/:tourId', function (req, res, next) {
  if (!res.locals.userSession) {
    res.redirect('/signin');
    return;
  };
  next();
}, async function (req, res, next) {
  var doc = await db.tours.findById(req.params.tourId);
  res.render('payforTour', { title: 'Express', doc: doc });
});

/* Post booking Detail page. */
router.post('/pay/:tourId', function (req, res, next) {
  if (!res.locals.userSession) {
    res.redirect('/signin');
    return;
  };
  next();
}, async function (req, res, next) {
  const tour = await db.tours.findById(req.params.tourId);
  const newBooking = new db.booking({
    _id: new mongoose.Types.ObjectId(),
    _tourId: tour._id,
    _customerId: res.locals.userSession._id,
    Ntickets: Number(req.body.Ntickets),
    price: tour.price,
    NCtickets: Number(req.body.NCtickets),
    priceChildren: tour.priceChildren,
    dateBook: Date.now(),
    status: 'Đang xử lý...',
  });
  newBooking.save();

  res.redirect('/tour/booked');
});

module.exports = router;
