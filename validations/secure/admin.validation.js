const db = require('../../models/index.model');

const handler = require('../../middlewares/handler');

module.exports.postNewTourCg = async function (req, res, next) {
    const check = await db.categoryTour.findById(handler.hash(req.body.zone).toLowerCase());
    if (check) {
        const doccument = {
            user: req.body.user,
            error: "Loại tour đã tồn tại!!",
        };
        res.render('secure/categorytour/additional', doccument);
        return;
    }

    next();
};

module.exports.postNewPlaceStart = async function (req, res, next) {
    const check = await db.placeStart.findById(handler.hash(req.body.placeStart).toLowerCase());
    if (check) {
        var placeStart = await db.placeStart.find().sort({ _id: 'ascending' });
        var arrdanhmuc = ['Địa điểm khởi hành', 'Mô tả', 'Thao tác'];
        const doccument = {
            user: req.body.user,
            placeStart: placeStart,
            arrdanhmuc: arrdanhmuc,
            error: "Địa điểm đã tồn tại!!",
        };
        res.render('secure/placeStart/index', doccument);
        return;
    }
    next();
};