var express = require('express');
var router = express.Router();

var db = require('../models/index.model');

/* GET Category Tour page. */
router.get('/', async function (req, res, next) {
  var joinCategoryTour = await db.joinCategoryTour.find().populate('_tourId _categoryId');
  const doccument = {
    title: 'Express',
    docs: joinCategoryTour.filter(doc => doc._categoryId.catagory === 1).map(doc => {
      return {
        _id: doc._tourId._id,
        nameTour: doc._tourId.nameTour,
        price: doc._tourId.price,
        image: doc._tourId.image,
      }
    }),
  }
  res.render('tourInCountry', doccument);
});

/* GET Category Tour page. */
router.get('/:categoryId', async function (req, res, next) {
  var zone = await db.categoryTour.findById(req.params.categoryId);
  var joinCategoryTour = await db.joinCategoryTour.find({ _categoryId: req.params.categoryId }).populate('_tourId _categoryId');
  const doccument = {
    title: `Danh sách ${zone.zone}`,
    docs: joinCategoryTour.filter(doc => doc._categoryId.catagory === 1).map(doc => {
      return {
        _id: doc._tourId._id,
        nameTour: doc._tourId.nameTour,
        price: doc._tourId.price,
        image: doc._tourId.image,
      }
    }),
  }
  res.render('tourInCountry', doccument);
});


module.exports = router;
