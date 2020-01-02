var express = require('express');
var router = express.Router();
const paypal = require('paypal-rest-sdk');
var mongoose = require('mongoose');
const environment = require('../environments');
var db = require('../models/index.model');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id':
    'AeaYCx92AP655cD1bU4_-3OD-sUZPB6fHc-Z_EnsHVzGzvZ8LtnBjY6w1ECFRY_fJITgXiu99ntebV8K',
  'client_secret':
    'EOuwSeIKvCKp5kJTb7-3PUaFwJLdS9r50ctEztL0U5KNnD08_b2XueCdRyEoo0YfvbAWFE8yLHvyHD7m'
});

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
  const booked = await db.booking.find({ _customerId: res.locals.userSession._id }).populate('_tourId').sort({ dateBook: 'descending' });

  function DateFormat(params) {
    var Re = `${params.getDate()}/${params.getMonth() + 1}/${params.getFullYear()} ${params.getHours()}:${params.getMinutes()}:${params.getSeconds()} `
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
  const price = Math.ceil(Number(tour.price) / 23200);
  const priceChildren = Math.ceil(Number(tour.priceChildren) / 23200);
  const Ntickets = Number(req.body.Ntickets);
  const NCtickets = Number(req.body.NCtickets);
  const items = [];
  switch (NCtickets) {
    case 0:
      items.push({
        "name": tour.nameTour + "(Vé người lớn)",
        "sku": tour._id,
        "price": `${price}.00`,
        "currency": "USD",
        "quantity": Ntickets
      });
      break;

    default:
      items.push({
        "name": tour.nameTour + "(Vé người lớn)",
        "sku": tour._id,
        "price": `${price}.00`,
        "currency": "USD",
        "quantity": Ntickets
      }, {
        "name": tour.nameTour + "(Vé trẻ em)",
        "sku": tour._id + "em",
        "price": `${priceChildren}.00`,
        "currency": "USD",
        "quantity": NCtickets
      });
      break;
  }

  var create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": `http://${environment.localhost}:${environment.port}/tour/booking/success`,
      "cancel_url": `http://${environment.localhost}:${environment.port}`
    },
    "transactions": [{
      "item_list": {
        "items": items
      },
      "amount": {
        "currency": "USD",
        "total": `${price * Ntickets + priceChildren * NCtickets}.00`
      },
      "description": "This is the payment description."
    }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});

router.get('/booking/success', function (req, res, next) {
  if (!res.locals.userSession) {
    res.redirect('/signin');
    return;
  };
  next();
}, function (req, res, next) {
  const payerId = req.query.PayerID
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    'payer_id': payerId,
  };

  paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      const arrItems = payment.transactions[0].item_list.items;
      const tour = await db.tours.findById(arrItems[0].sku);
      const newBooking = new db.booking({
        _id: new mongoose.Types.ObjectId(),
        _tourId: tour._id,
        _customerId: res.locals.userSession._id,
        Ntickets: arrItems[0].quantity,
        price: tour.price,
        NCtickets: arrItems.length >= 2 ? arrItems[1].quantity : 0,
        priceChildren: tour.priceChildren,
        dateBook: Date.now(),
        status: 'Đã Đặt',
      });
      newBooking.save();
      res.redirect('/tour/booked');
    }
  });
});

router.get('/book/:id', function (req, res, next) {
  if (!res.locals.userSession) {
    res.redirect('/signin');
    return;
  };
  next();
}, async function name(req, res, next) {
  const tour = await db.tours.findById(req.params.id);
  const newBooking = new db.booking({
    _id: new mongoose.Types.ObjectId(),
    _tourId: tour._id,
    _customerId: res.locals.userSession._id,
    Ntickets: req.query.Ntickets,
    price: tour.price,
    NCtickets: req.query.NCtickets,
    priceChildren: tour.priceChildren,
    dateBook: Date.now(),
    status: 'Đang xử lý...',
  });
  newBooking.save();
  res.redirect('/tour/booked');
});

module.exports = router;
