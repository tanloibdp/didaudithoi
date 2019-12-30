const express = require('Express');
const multer = require('multer');

const controller = require('../../controllers/secure/admin.controller');
const validate = require('../../validations/validation');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/imageTour');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

var cpUpload = upload.fields([{ name: 'imageTour', maxCount: 1 },
{ name: 'imageTour2', maxCount: 1 },
{ name: 'imageTour3', maxCount: 1 },
{ name: 'imageTour4', maxCount: 1 },
{ name: 'imageTour5', maxCount: 1 }]);

const router = express.Router();

router.use(validate.signin.getCookie);

router.use(function (req, res, next) {
    if (req.body.user.role == 3) {
        res.redirect('/');
        return;
    }
    next();
});

router.get('/', controller.getAdmin);

router.get('/tour', controller.getTour);

router.get('/tour/:tourId', controller.getTourId);

router.post('/tour/:tourId', cpUpload, controller.postTourId);

router.get('/new/tour', controller.getAddTour);

router.post('/new/tour', cpUpload, controller.postAddTour);

router.get('/delete/tour/:tourId', controller.deleteTourId);

router.get('/categorytour', controller.getTourCg);

router.post('/categorytour', controller.getTourCg);

router.get('/new/categorytour', controller.getNewTourCg);

router.post('/new/categorytour', validate.admin.postNewTourCg, controller.postNewTourCg);

router.get('/categorytour/:categoryTourId', controller.getTourCgId);

router.post('/categorytour/:categoryTourId', controller.postTourCgId);

router.get('/delete/categorytour/:categoryTourId', controller.DeleteTourCgId);

router.get('/delete/joincategorytour/:joincategorytour', controller.DeleteJoinTourCgId);

router.get('/placeStart', controller.getPlaceStart);

router.post('/new/placeStart', validate.admin.postNewPlaceStart, controller.postNewPlaceStart);

router.get('/delete/placeStart/:placeStartId', controller.DeletePlaceStart);

router.get('/booked', controller.getBooked);

router.post('/booked/:bookedId', controller.postBooked);

module.exports = router;